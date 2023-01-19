import {gql, GraphQLClient} from "graphql-request";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentDots, faStickyNote} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import styles from './organisation.module.scss'
import {useRouter} from "next/router";
import {Contact, Note} from "../../models/contact";
import Moment from "react-moment";
import Link from "next/link";
import {
    GetContactNotes,
    GetConversationsForContact,
} from "../../services/contactService";
import {Skeleton} from "primereact/skeleton";



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
                .map((e: any) => ({...e, type: "CONVERSATION"}))
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
            const date1 = a?.createdAt
            const date2 = b?.createdAt
            // @ts-ignore
            return date1 ?  new Date(date1) - new Date(date2) : 0;
        })
    }

    if (loadingNotes || loadingConversations) {
      return (
          <div className="flex flex-column mt-4">
            <Skeleton className="mb-3" />
            <Skeleton  className="mb-3"/>
            <Skeleton  className="mb-3"/>
            <Skeleton  className="mb-3"/>
            <Skeleton/>
        </div>
      )
    }

    if(!loadingNotes && !loadingConversations && historyItems.length === 0 && historyNotes.length === 0) {
        return (
            <p className="text-gray-600 font-italic mt-4">
                No activity logged yet
            </p>
        )
    }


    return (
        <div className="mt-5">
            {
                getSortedItems(historyItems, historyNotes).map((e: any) => (
                    <div key={e.id}>
                        {e.type === "NOTE" && (
                            <div className="flex  w-full mt-2 mb-3">
                                <div className="flex flex-grow-0 mr-2">
                                    <FontAwesomeIcon icon={faStickyNote} className="mr-2" style={{fontSize: '1.2rem', color: `var(--gray-color-5)`}}/>
                                </div>
                                <div className="w-full ">

                                    <div className={`${styles.noteContent} text-gray-700`} dangerouslySetInnerHTML={{__html: e.html}}></div>
                                    <div className={styles.noteData}>
                                        <Moment className="text-sm text-gray-600" date={e.startedAt} format={'h:m d MMM yy'}>{e.createdAt}</Moment>
                                        <div className="text-sm text-gray-600"> {e.createdBy?.firstName || 'Anna Nowak'} {" "} {e.createdBy?.lastName}</div>

                                    </div>


                                </div>
                            </div>

                        )}
                        {e.type === "CONVERSATION" && (
                            <div  className={`flex align-items-center w-full mt-4 mb-3`}>

                                <div className="flex flex-grow-0">
                                    <FontAwesomeIcon icon={faCommentDots} className="mr-2" style={{fontSize: '1.2rem', color: `var(--gray-color-5)`}}/>
                                </div>

                                <div className="flex flex-grow-1 p-2 bg-white">

                                    <div className="flex flex-grow-1 align-items-center">

                                        <div className="">
                                            <Link href={`${process.env.OASIS_GUI_PATH}/feed?id=${e.id}`} target="_blank" className='cta'>Show more details...</Link>
                                        </div>
                                    </div>

                                    <div className="flex flex-grow-0 ">
                                        {e.user?.firstName} {e.user?.lastName}
                                    </div>
                                    <div className={styles.noteTime}>
                                        <Moment className="text-sm text-gray-600" date={e.startedAt} format={'d MMM yy'}>{e.createdAt}</Moment>
                                    </div>
                                </div>
                            </div>

                        )}
                    </div>

                ))
            }
        </div>
    )
}
