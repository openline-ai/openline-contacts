import React, {useEffect, useState} from 'react';
import styles from './conversation-timeline-item.module.scss'
import {Button, Message} from "../../atoms";
import axios from "axios";
import {FeedItem} from "../../../models/feed-item";
import {gql, GraphQLClient} from "graphql-request";
import {toast} from "react-toastify";
import useWebSocket from "react-use-websocket";
import {ConversationItem} from "../../../models/conversation-item";
import {ProgressSpinner} from "primereact/progressspinner";
import {Skeleton} from "primereact/skeleton";
interface Props  {
    feedId: string

}

export const ConversationTimelineItem: React.FC<Props> = (
    { feedId}
) => {
    const client = new GraphQLClient(`/customer-os-api/query`);

    const {lastMessage} = useWebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_PATH}/${feedId}`, {
        onOpen: () => console.log('Websocket opened'),
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => true,
    })

    const [feedInitiator, setFeedInitiator] = useState({
        loaded: false,
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });



    const [messages, setMessages] = useState([] as ConversationItem[]);

    const [loadingMessages, setLoadingMessages] = useState(false)

    useEffect(() => {
            setLoadingMessages(true);
        console.log('🏷️ ----- feedId: '
            , feedId);
        axios.get(`/oasis-api/feed/${feedId}`)
            .then(res => {
                const feedItem = res.data as FeedItem;
            console.log('🏷️ ----- res: '
                , res);
            if (feedItem.initiatorType === 'CONTACT') {
                console.log('🏷️ ----- "CONTACT": '
                    , "CONTACT");
                const query = gql`query GetContactDetails($email: String!) {
                        contact_ByEmail(email: $email) {
                            id
                            firstName
                            lastName
                            emails {
                                email
                            }
                            phoneNumbers {
                                e164
                            }
                        }
                    }`

                    client.request(query, {email: feedItem.initiatorUsername}).then((response: any) => {
                        if (response.contact_ByEmail) {
                            setFeedInitiator({
                                loaded: true,
                                firstName: response.contact_ByEmail.firstName,
                                lastName: response.contact_ByEmail.lastName,
                                email: response.contact_ByEmail.emails[0]?.email ?? undefined,
                                phoneNumber: response.contact_ByEmail.phoneNumbers[0]?.e164 ?? undefined
                            });
                        } else {
                            //todo log on backend
                            toast.error("There was a problem on our side and we are doing our best to solve it!");
                        }
                    }).catch(reason => {
                        //todo log on backend
                        toast.error("There was a problem on our side and we are doing our best to solve it!");
                    });

                    //TODO move initiator in index
                } else if (feedItem.initiatorUsername === 'USER') {
                console.log('🏷️ ----- "USER": '
                    , "USER");
                
                
                
                
                
                
                
                const query = gql`query GetUserById {
                        user(id: "${feedItem.initiatorUsername}") {
                            id
                            firstName
                            lastName
                        }
                    }`

                    client.request(query).then((response: any) => {
                        if (response.user) {
                            setFeedInitiator({
                                loaded: true,
                                firstName: response.user.firstName,
                                lastName: response.user.lastName,
                                email: response.user.emails[0]?.email ?? undefined,
                                phoneNumber: response.user.phoneNumbers[0]?.e164 ?? undefined //TODO user doesn't have phone in backend
                            });
                        } else {
                            //TODO log on backend
                            toast.error("There was a problem on our side and we are doing our best to solve it!");
                        }
                    }).catch(reason => {
                        //TODO log on backend
                        toast.error("There was a problem on our side and we are doing our best to solve it!");
                    });

                }

            }).catch((reason: any) => {
                //todo log on backend
                console.log('🏷️'
                    , reason);
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });

            axios.get(`/oasis-api/feed/${feedId}/item`)
                .then(res => {
                    setMessages(res.data ?? []);
                }).catch((reason: any) => {
                //todo log on backend
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
    }, []);

    //when a new message appears, scroll to the end of container
    useEffect(() => {
        if (messages && feedInitiator.loaded) {
            setLoadingMessages(false);
        }
    }, [messages, feedInitiator]);


    useEffect(() => {
        if (lastMessage && Object.keys(lastMessage).length !== 0 && lastMessage.data.length > 0) {
            handleWebsocketMessage(JSON.parse(lastMessage.data));
        }
    }, [lastMessage]);


    const handleWebsocketMessage = function (msg: any) {
        let newMsg = {
            content: msg.message,
            username: msg.username,
            channel: 1,
            time: msg.time,
            id: msg.id,
            direction: msg.direction == "OUTBOUND" ? 1 : 0,
            contact: {},
        };

        setMessages((messageList: any) => [...messageList, newMsg]);
    }

    return (
        <div className='flex flex-column h-full w-full'>
            <div className="flex-grow-1 w-full">
                {
                    loadingMessages &&
                    <div className="flex flex-column mb-2">
                        <div className="mb-2 flex justify-content-end">
                            <Skeleton height="40px" width="50%" />
                        </div>
                        <div className="mb-2 flex justify-content-start">
                            <Skeleton height="50px" width="40%" />
                        </div>
                        <div className="flex justify-content-end mb-2">
                            <Skeleton height="45px" width="50%" />
                        </div>
                        <div className="flex justify-content-start">
                            <Skeleton height="40px" width="45%" />
                        </div>
                    </div>
                }

                <div className="flex flex-column">
                    {
                        !loadingMessages &&
                        messages.map((msg: ConversationItem, index: number) => {
                            const lines = msg.content.split('\n');

                            const filtered: string[] = lines.filter((line: string) => {
                                return line.indexOf('>') != 0;
                            });
                            msg.content = filtered.join('\n').trim();

                            const time = new Date(1970, 0, 1).setSeconds(msg.time.seconds);

                            return <Message key={msg.id}
                                            message={msg}
                                            feedInitiator={feedInitiator}
                                            date={time}
                                            previousMessage={messages?.[index - 1]?.direction || null}
                                            index={index} />
                        })
                    }
                </div>
            </div>
        </div>
    );
};

