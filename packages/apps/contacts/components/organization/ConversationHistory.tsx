import {gql, GraphQLClient} from "graphql-request";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentDots, faStickyNote} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import styles from './organisation.module.scss'
import {useRouter} from "next/router";
import {Contact, } from "../../models/contact";
import Moment from "react-moment";
import Link from "next/link";
import {
    GetContactNotes,
    GetConversationsForContact,
} from "../../services/contactService";
import {Skeleton} from "primereact/skeleton";
import {ConversationTimelineItem, EmailTimelineItem, NoteTimelineItem} from "../molecules";
import {TimelineItem} from "../atoms/timeline-item";
import {Timeline} from "../organisms";


export const OrganizationHistory = ({contacts}: {contacts: any}) => {
    const client = new GraphQLClient(`/customer-os-api/query`);
    const router = useRouter();
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [historyItems, setHistoryItems] = useState([] as any);
    const [historyNotes, setHistoryNotes] = useState([] as any);

    useEffect(() => {

        const requestsConversations = contacts.map(({id}: Contact) => {
            return GetConversationsForContact(client, (id as string), {page: 0, limit: 99999})
        })

        const requestsNotes = contacts.map(({id}: Contact) => {
                return GetContactNotes(client, (id as string), {page: 0, limit: 99999})
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
        Promise.all(requestsNotes).then((response: any) => {
            const newNotes = response
                .map((e: { content: any; }) => e.content)
                .flat()
                .map((e: any) => ({...e, type: "NOTE"}))
            setHistoryNotes(newNotes);
            setLoadingNotes(false);
        });
    }, []);

    const getSortedItems = (data1: Array<any>, data2:Array<any>) => {
        return [...data1, ...data2].sort((a, b) => {
            // @ts-ignore
            return  Date.parse(b?.createdAt) - Date.parse(a?.createdAt);
        })
    }


    return (
        <div className="mt-5">

            <Timeline loading={loadingNotes || loadingConversations}
                      noActivity={!loadingNotes && !loadingConversations && historyItems.length === 0 && historyNotes.length === 0}
                      loggedActivities={getSortedItems(historyItems, historyNotes)} />

        </div>
    )
}
