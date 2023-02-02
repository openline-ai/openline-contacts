import PropTypes, {string} from "prop-types";
import React, {useEffect, useState} from "react";
import {gql} from "graphql-request";
import {PaginatedResponse, Pagination} from "../../utils/pagination";
import {Skeleton} from "primereact/skeleton";
import {useGraphQLClient} from "../../utils/graphQLClient";
import {GetActionsForContact, GetContactNotes} from "../../services/contactService";
import {Contact, ContactWithActions, Note} from "../../models/contact";
import {toast} from "react-toastify";
import {Timeline} from "../organisms";

interface Props {
    contactId:string | Array<string>,
    reload: boolean
    setReload: (state: boolean) => void
}
function ContactHistory(props: Props) {
    const client =  useGraphQLClient();

    const [conversationsLoading, setConversationLoading] = useState(true);
    const [notesLoading, setNoteLoading] = useState(true);
    const [actionsLoading, setActionsLoading] = useState(true);

    const [conversationHistory, setConversationHistory] = useState([] as any);
    const [noteItems, setNoteItems] = useState([] as any);
    const [actions, setActions] = useState([] as any);

    useEffect(() => {
        if (props.contactId) {
            GetActionsForContact(
                client,
                props.contactId as string,
            ).then((contact: ContactWithActions) => {
                setActions(contact.actions)
                setActionsLoading(false)
            }).catch((reason: any) => {
                //todo log an error in server side
                setActionsLoading(false)
                toast.error("HERE ");
            });

            GetContactNotes(client, (props.contactId as string)).then(async (result: PaginatedResponse<Note>) => {
                if (result) {
                    setNoteItems(result.content.map((data) => ({...data, type: "NOTE"})));
                    setNoteLoading(false);
                    props.setReload(false)
                } else {
                    setNoteLoading(false)
                    //todo log an error in server side
                    toast.error("There was a problem on our side and we are doing our best to solve it!");
                }
            }).catch((reason: any) => {
                setNoteLoading(false)
                props.setReload(false)
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }

    }, [props.contactId, props.reload]);

    useEffect(() => {
        if (props.contactId) {
            GetActionsForContact(
                client,
                props.contactId as string,
            ).then((contact: ContactWithActions) => {
                setActions(contact.actions.map(e => ({...e, createdAt: e.startedAt, type: "ACTION"})))
            }).catch((reason: any) => {
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }
    }, [props.contactId]);


    useEffect(() => {
        if (props.contactId) {
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

    const getSortedItems = (data1: Array<any>, data2:Array<any>, data3: Array<any>) => {
        return [...data1, ...data2, ...data3].sort((a, b) => {
            // @ts-ignore
            return  Date.parse(b?.createdAt) - Date.parse(a?.createdAt);
        })
    }


    return (
            <Timeline
                loading={conversationsLoading || notesLoading || actionsLoading}
                noActivity={noHistoryItemsAvailable}
                contactId={props.contactId as string}
                notifyChange={props.setReload}
                loggedActivities={getSortedItems(conversationHistory, noteItems, actions)} />

    );
}

export default ContactHistory
