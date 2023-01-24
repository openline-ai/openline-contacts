import PropTypes, {string} from "prop-types";
import React, {useEffect, useState} from "react";
import {gql} from "graphql-request";
import {PaginatedResponse, Pagination} from "../../utils/pagination";
import {Skeleton} from "primereact/skeleton";
import {useGraphQLClient} from "../../utils/graphQLClient";
import {GetContactNotes} from "../../services/contactService";
import {Note} from "../../models/contact";
import {toast} from "react-toastify";
import {Timeline} from "../organisms";

function ContactHistory(props: any) {
    const client =  useGraphQLClient();

    const [conversationsLoading, setConversationLoading] = useState(true);
    const [notesLoading, setNoteLoading] = useState(true);
    const [noteTotalElements, setNoteTotalElements] = useState(0);

    const [conversationHistory, setConversationHistory] = useState([] as any);
    const [noteItems, setNoteItems] = useState([] as any);

    useEffect(() => {
        if (props.contactId) {

            GetContactNotes(client, (props.contactId as string), {page: 0, limit: 100}).then(async (result: PaginatedResponse<Note>) => {
                if (result) {
                    setNoteItems(result.content.map((data) => ({...data, type: "NOTE"})));
                    setNoteTotalElements(result.totalElements);
                    setNoteLoading(false);
                } else {
                    setNoteLoading(false)
                    //todo log an error in server side
                    toast.error("There was a problem on our side and we are doing our best to solve it!");
                }
            }).catch((reason: any) => {
                setNoteLoading(false)
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });

            const query = gql`query GetConversationsForContact($id: ID!, $pagination: Pagination!) {
                contact(id: $id) {
                    conversations(pagination: $pagination) {
                        content {
                            id
                            startedAt
                        }
                    }
                }
            }`

            client.request(query, {
                id: props.contactId,
                pagination: {
                    page: 0,
                    limit: 10
                } as Pagination
            }).then((response: any) => {
                const conversationsHistory = response.contact.conversations.content
                    .map((data:any) => ({...data, type: "CONVERSATION", createdAt: data.startedAt}))
                setConversationHistory(conversationsHistory);
                setConversationLoading(false);
            }).catch(() => {
                toast.error("There was a problem on our side and we are doing our best to solve it!");
                setConversationLoading(false);
            });
        }

    }, [props.contactId]);

    const noHistoryItemsAvailable =  !conversationsLoading && conversationHistory.length == 0 && !notesLoading && noteItems.length == 0

    const getSortedItems = (data1: Array<any>, data2:Array<any>) => {
        return [...data1, ...data2].sort((a, b) => {
            // @ts-ignore
            return  Date.parse(b?.createdAt) - Date.parse(a?.createdAt);
        })
    }


    return (
        <div>
            <div>

                {
                    conversationsLoading || notesLoading &&
                    <>
                        <Skeleton className="w-full mt-3" height="1rem"/>
                        <Skeleton className="w-full mt-3" height="1rem"/>
                        <Skeleton className="w-full mt-3" height="1rem"/>
                        <Skeleton className="w-full mt-3" height="1rem"/>
                        <Skeleton className="w-full mt-3" height="1rem"/>
                    </>
                }

                {
                    noHistoryItemsAvailable &&
                    <div className="flex">
                        <div className="flex flex-grow-1 p-2 bg-white border-dark-1 mt-3">
                            No activity logged yet
                        </div>
                    </div>
                }

                <Timeline loading={conversationsLoading || notesLoading}
                          noActivity={noHistoryItemsAvailable}
                          loggedActivities={getSortedItems(conversationHistory, noteItems)} />

            </div>
        </div>
    );
}

ContactHistory.propTypes = {
    contactId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(string)
    ]) || undefined,
    className: PropTypes.arrayOf(string)
}

export default ContactHistory
