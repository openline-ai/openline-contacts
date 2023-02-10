import React, {useEffect, useState} from "react";
import {Contact,} from "../../models/contact";
import {GetActionsForContact, GetContactNotes, GetConversationsForContact,} from "../../services/contactService";
import {Timeline} from "../organisms";
import {useGraphQLClient} from "../../utils/graphQLClient";
import {GetOrganizationNotes} from "../../services/organizationService";
import {toast} from "react-toastify";

interface Props {
    refreshNotes: boolean
    setRefreshNotes: (newState: boolean) => void
    contacts: any
    organizationId: string
}

export const OrganizationHistory = ({contacts, organizationId, refreshNotes, setRefreshNotes}: Props) => {
    const client = useGraphQLClient();
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingOrganizationNotes, setLoadingOrganizationNotes] = useState(true);
    const [loadingWebActions, setLoadingWebActions] = useState(false);
    const [historyItems, setHistoryItems] = useState([] as any);
    const [contactNotes, setContactNotes] = useState([] as any);
    const [organizationNotes, setOrganizationNotes] = useState([] as any);
    const [historyWebActions, setHistoryWebActions] = useState([] as any);
    const [refreshContactNotes, setRefreshContactNotes] = useState(false);

    useEffect(() => {

        const requestsConversations = contacts.map(({id}: Contact) => {
            return GetConversationsForContact(client, (id as string), {page: 0, limit: 99999})
        })

        const requestsNotes = contacts.map(({id}: Contact) => {
            return GetContactNotes(client, (id as string))
        })
        const requestsActions = contacts.map(({id}: Contact) => {
            return GetActionsForContact(client, (id as string))
        })

        Promise.all(requestsConversations).then((response: any) => {
            const conversations = response
                .map((e: { content: any; }) => {
                    return e.content
                })
                .flat()
                .map((e: any) => {
                    return {...e, type: "CONVERSATION"}
                })
                // filter out duplicates - needed because multiple contacts might be party of the same conversation
                .filter(
                    (conv1: any, i: number, a: any) => a
                        .findIndex((conv: any) => (conv.id === conv1.id)) === i
                )

            setHistoryItems(conversations);
            setLoadingConversations(false);
        });
        Promise.all(requestsActions).then((response: any) => {
            const result = response
                .filter((data: any) => !!data.actions.length)
                .map(({actions, firstName, lastName}: any) => actions
                    .map((action: any) => ({
                        ...action,
                        createdAt: action?.startedAt,
                        type: "ACTION",
                        contactName: `${firstName} ${" "} ${lastName}`
                    })))
                .flat()

            setHistoryWebActions(result);
            setLoadingWebActions(false);
        });

        Promise.all(requestsNotes).then((response: any) => {
            const newNotes = response
                .map((e: { content: any; }) => e.content)
                .flat()
                .map((e: any) => ({...e, type: "NOTE", readOnly: true}))
            setContactNotes(newNotes);
            setLoadingNotes(false);
        });
    }, []);

    useEffect(() => {
        if (refreshNotes) {
            const requestsNotes = contacts.map(({id}: Contact) => {
                return GetContactNotes(client, (id as string))
            })

            Promise.all(requestsNotes).then((response: any) => {
                const newNotes = response
                    .map((e: { content: any; }) => e.content)
                    .flat()
                    .map((e: any) => ({...e, type: "NOTE", contact: true}))
                setContactNotes(newNotes);
                setRefreshContactNotes(false)
                setLoadingNotes(false);
            });
        }

    }, [refreshContactNotes]);

    useEffect(() => {
        GetOrganizationNotes(client, organizationId).then((response) => {
            setRefreshNotes(false)
            setOrganizationNotes(response.map(e => ({...e, type: "NOTE"})))
            setLoadingOrganizationNotes(false)
        }).catch((e) => {
            setLoadingOrganizationNotes(false)
            setRefreshNotes(false)
            toast.error("There was a problem on our side and we cannot load organization notes data at the moment,  we are doing our best to solve it! ");
        })
    }, [organizationId])

    useEffect(() => {
        if (refreshNotes) {
            setLoadingOrganizationNotes(true)
            GetOrganizationNotes(client, organizationId).then((response) => {
                setOrganizationNotes(response.map(e => ({...e, type: "NOTE"})))
                setLoadingOrganizationNotes(false)
                setRefreshNotes(false)
            }).catch(() => {
                setLoadingOrganizationNotes(false)
                setRefreshNotes(false)
                toast.error("There was a problem on our side and we cannot load organization notes at the moment,  we are doing our best to solve it! ");
            })
        }

    }, [organizationId, refreshNotes])

    const getSortedItems = (data1: Array<any>, data2: Array<any>, data3: Array<any>, data4: Array<any>) => {
        return [...data1, ...data2, ...data3, ...data4].sort((a, b) => {
            // @ts-ignore
            return Date.parse(b?.createdAt) - Date.parse(a?.createdAt);
        })
    }

    return (
        <Timeline
            loading={loadingNotes || loadingConversations || loadingWebActions || loadingOrganizationNotes}
            noActivity={!loadingNotes &&
                (!loadingConversations
                    && historyItems.length === 0
                    && contactNotes.length === 0
                    && historyWebActions.length === 0
                    && organizationNotes.length === 0
                )}
            notifyChange={setRefreshNotes}
            notifyContactNotesUpdate={setRefreshContactNotes}
            loggedActivities={getSortedItems(historyItems, contactNotes, historyWebActions, organizationNotes)}/>
    )
}
