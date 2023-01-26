import React, {useEffect, useState} from 'react';
import {Message} from "../../atoms";
import axios from "axios";
import {FeedItem} from "../../../models/feed-item";
import {gql} from "graphql-request";
import {toast} from "react-toastify";
import useWebSocket from "react-use-websocket";
import {ConversationItem} from "../../../models/conversation-item";
import {Skeleton} from "primereact/skeleton";
import {useGraphQLClient} from "../../../utils/graphQLClient";
import {EmailTimelineItem} from "../email-timeline-item";
interface Props  {
    feedId: string
    source: string
}



export const ConversationTimelineItem: React.FC<Props> = (
    { feedId, source}
) => {
    const client =  useGraphQLClient()


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
        axios.get(`/oasis-api/feed/${feedId}`)
            .then(res => {
                const feedItem = res.data as FeedItem;

            if(feedItem.initiatorType !== 'CONTACT') {
                setFeedInitiator({
                    loaded: true,
                    email: feedItem.initiatorUsername,
                    firstName: feedItem.initiatorFirstName,
                    lastName: feedItem.initiatorLastName,
                    phoneNumber: ''
                })
            }

            if (feedItem.initiatorType === 'CONTACT') {

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
                }

            }).catch((reason: any) => {
                //todo log on backend

                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });

            axios.get(`/oasis-api/feed/${feedId}/item`)
                .then(res => {
                    setMessages(res.data ?? []);
                    setLoadingMessages(false)
                }).catch((reason: any) => {
                setLoadingMessages(false)
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


    const decodeChannel = (channel: number) => {
        switch (channel) {
            case 0:
                return "Web chat";
            case 1:
                return "Email";
            case 2:
                return "WhatsApp";
            case 3:
                return "Facebook";
            case 4:
                return "Twitter";
            case 5:
                return "Phone call";
        }
        return "";
    }


    console.log('🏷️ ----- source: '
        , source);

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
                            const lines = msg?.content.split('\n');

                            const filtered: string[] = lines.filter((line: string) => {
                                return line.indexOf('>') !== 0;
                            });
                            msg.content = filtered.join('\n').trim();

                            const time = new Date(1970, 0, 1).setSeconds(msg?.time?.seconds);
                            switch (msg.type) {
                                // 0 = web chat
                                // 2 =whats app
                                case 0:
                                case 2:
                                    return <Message key={msg.id}
                                                    message={msg}
                                                    feedInitiator={feedInitiator}
                                                    date={time}
                                                    previousMessage={messages?.[index - 1]?.direction || null}
                                                    index={index} />
                                case 1:
                                    return <EmailTimelineItem
                                        emailContent={msg?.content}
                                        sender={msg?.senderUserName || 'Unknown'}
                                        recipients={""}
                                        subject={""}
                                    />
                                // case 3:
                                //     return "Facebook";
                                // case 4:
                                //     return "Twitter";
                                // case 5:
                                //     return "Phone call";
                            }
                            return null;

                        })
                    }
                    <span className="text-sm "> { `Source: ${source?.toLowerCase() || 'unknown'}`}</span>
                </div>
            </div>
        </div>
    );
};

