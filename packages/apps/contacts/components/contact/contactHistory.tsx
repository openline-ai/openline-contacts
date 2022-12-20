import PropTypes, {string} from "prop-types";
import {useEffect, useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentDots} from "@fortawesome/free-solid-svg-icons";
import {Pagination} from "../../utils/pagination";
import Moment from "react-moment";
import Link from "next/link";
import {Skeleton} from "primereact/skeleton";

function ContactHistory(props: any) {
    const client = new GraphQLClient(`/customer-os-api/query`);

    const [loading, setLoading] = useState(true);
    const [historyItems, setHistoryItems] = useState([] as any);

    useEffect(() => {
        if (props.contactId) {

            const query = gql`query GetConversationsForContact($id: ID!, $pagination: Pagination!) {
                contact(id: $id) {
                    conversations(pagination: $pagination) {
                        content {
                            id
                            startedAt
                            user {
                                id
                                firstName
                                lastName
                            }
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
                setHistoryItems(response.contact.conversations.content);
                setLoading(false);
            });
        }

    }, [props.contactId]);

    return (
        <div className='w-full h-full'>
            <div>

                {
                    loading &&
                    <>
                        <Skeleton className="w-full mt-3" height="1rem"/>
                        <Skeleton className="w-full mt-3" height="1rem"/>
                        <Skeleton className="w-full mt-3" height="1rem"/>
                        <Skeleton className="w-full mt-3" height="1rem"/>
                        <Skeleton className="w-full mt-3" height="1rem"/>
                    </>
                }

                {
                    !loading && historyItems.length == 0 &&
                    <div className="flex">
                        <div className="flex flex-grow-1 p-2 bg-white border-dark-1 mt-3">
                            No activity logged yet
                        </div>
                    </div>
                }

                {
                    !loading && historyItems.map((e: any) => {
                        return <div key={e.id} className="flex align-items-center w-full mt-3">

                            <div className="flex flex-grow-0">
                                <FontAwesomeIcon icon={faCommentDots} className="mr-2" style={{fontSize: '1.2rem', color: `var(--gray-color-5)`}}/>
                            </div>

                            <div className="flex flex-grow-1 p-2 bg-white">

                                <div className="flex flex-grow-1 align-items-center">
                                    <div className="mr-3">Conversation</div>
                                    <Moment className="text-sm text-gray-600" date={e.startedAt} format={'d MMM yy'}></Moment>

                                    <div className="ml-3">
                                        <Link href={`${process.env.OASIS_GUI_PATH}/feed/${e.id}`} target="_blank" className='cta'>Show more details...</Link>
                                    </div>
                                </div>

                                <div className="flex flex-grow-0 ">
                                    ${e.user.firstName} ${e.user.lastName}
                                </div>

                            </div>

                        </div>

                    })
                }

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
