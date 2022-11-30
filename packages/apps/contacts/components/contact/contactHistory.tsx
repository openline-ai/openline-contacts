import PropTypes, {string} from "prop-types";
import {useEffect, useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentDots, faPhone} from "@fortawesome/free-solid-svg-icons";
import {Pagination} from "../../utils/pagination";
import Moment from "react-moment";
import Link from "next/link";

function ContactHistory(props: any) {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

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
            });
        }

    }, [props.contactId]);

    return (
        <div className='w-full h-full'>
            <div className="mb-3">
                <div className="flex flex-row">
                    <div className="flex-grow-1">
                        {/*hacky thing. put a picture to align the title with the breadcrumbs*/}
                        {
                            <FontAwesomeIcon size="xs" icon={faPhone} className="p-0 pt-2 pb-2 max-w-0 text-bg-color"/>
                        }
                        Activities
                    </div>
                </div>
            </div>
            <div>

                {
                    historyItems.length == 0 &&
                    <div className="flex">
                        <div className="flex flex-grow-1 p-2 bg-white bg-dark-1">
                            No activity logged yet
                        </div>
                    </div>
                }

                {
                    historyItems.map((e: any) => {
                        return <div key={e.id} className="flex align-items-center w-full mb-3">

                            <div className="flex flex-grow-0">
                                <FontAwesomeIcon icon={faCommentDots} className="mr-2" style={{fontSize: '1.2rem', color: `var(--gray-color-5)`}}/>
                            </div>

                            <div className="flex flex-grow-1 p-2 bg-white bg-dark-1">

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
