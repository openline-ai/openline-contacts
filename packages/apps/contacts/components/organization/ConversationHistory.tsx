import React, {useEffect, useState} from "react";
import {Contact, } from "../../models/contact";
import {
    GetActionsForContact,
    GetContactNotes,
    GetConversationsForContact,
} from "../../services/contactService";
import {Timeline} from "../organisms";
import {useGraphQLClient} from "../../utils/graphQLClient";


export const OrganizationHistory = ({contacts}: {contacts: any}) => {
    const client =  useGraphQLClient();
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingWebActions, setLoadingWebActions] = useState(false);
    const [historyItems, setHistoryItems] = useState([] as any);
    const [historyNotes, setHistoryNotes] = useState([] as any);
    const [historyWebActions, setHistoryWebActions] = useState([] as any);

    useEffect(() => {

        const requestsConversations = contacts.map(({id}: Contact) => {
            return GetConversationsForContact(client, (id as string), {page: 0, limit: 99999})
        })

        const requestsNotes = contacts.map(({id}: Contact) => {
                return GetContactNotes(client, (id as string), {page: 0, limit: 99999})
        })
        const requestsActions = contacts.map(({id}: Contact) => {
                return GetActionsForContact(client, (id as string))
        })


        Promise.all(requestsConversations).then((response: any) => {

            const conversations = response
                .map((e: { content: any; }) => {return e.content})
                .flat()
                .map((e: any) => {
                    return {...e, type: "CONVERSATION"}
                })
                // filter out duplicates - needed because multiple contacts might be party of the same conversation
                .filter(
                    (conv1: any, i: number, a: any) => a
                        .findIndex( (conv:any) => (conv.id === conv1.id)) === i
                )

            setHistoryItems(conversations);
            setLoadingConversations(false);
        });
        // Promise.all(requestsActions).then((response: any) => {
        //     const actions = response
        //         .map((e:any) => ({...e, createdAt: e?.startedAt, type: "ACTION"}))
        //
        //     setHistoryWebActions(actions);
        //     setLoadingWebActions(false);
        // });

        Promise.all(requestsNotes).then((response: any) => {
            const newNotes = response
                .map((e: { content: any; }) => e.content)
                .flat()
                .map((e: any) => ({...e, type: "NOTE"}))
            setHistoryNotes(newNotes);
            setLoadingNotes(false);
        });
    }, []);

    const getSortedItems = (data1: Array<any>, data2:Array<any>, data3: Array<any>) => {
        return [...data1, ...data2, ...data3].sort((a, b) => {
            // @ts-ignore
            return  Date.parse(b?.createdAt) - Date.parse(a?.createdAt);
        })
    }

    return (
        <div className="mt-5">
            <Timeline
                      readonly
                      loading={loadingNotes || loadingConversations || loadingWebActions}
                      noActivity={!loadingNotes &&
                          (!loadingConversations
                              && historyItems.length === 0
                              && historyNotes.length === 0
                              && historyWebActions.length === 0
                          )}
                      loggedActivities={getSortedItems(historyItems, historyNotes, historyWebActions)} />

        </div>
    )
}
