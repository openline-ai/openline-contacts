import PropTypes, {string} from "prop-types";
import {useEffect, useState} from "react";
import {GraphQLClient} from "graphql-request";
import {PaginatedResponse} from "../../../utils/pagination";
import {toast} from "react-toastify";
import {GetContactNotes} from "../../../services/contactService";
import {Note} from "../../../models/contact";
import {Skeleton} from "primereact/skeleton";
import ContactNoteTemplate from "./contactNoteTemplate";
import {useGraphQLClient} from "../../../utils/graphQLClient";


interface Props {
   contactId?: string | Array<string> 
   className?: Array<string>
   reload: boolean
   setReload: (newState: boolean) => void
}
function ContactNotes(props: Props) {
    const client =  useGraphQLClient();

    const [noteTotalElements, setNoteTotalElements] = useState(0);
    const [noteItems, setNoteItems] = useState([] as any);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (props.contactId) {
            loadNotes();
        }
    }, [props.contactId, props.reload]);

    const loadNotes = () => {
        setLoading(true);
        //todo add pagination
        GetContactNotes(client, (props.contactId as string), {page: 0, limit: 100}).then(async (result: PaginatedResponse<Note>) => {
            if (result) {
                setNoteItems(result.content);
                setNoteTotalElements(result.totalElements);
                setLoading(false);
            } else {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            }
        }).catch((reason: any) => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }

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
                    !loading &&
                    <>
                        
                        {
                            noteItems.length == 0 &&
                            <div className="flex">
                                <div className="flex flex-grow-1 p-2 mt-3">
                                    No notes added yet
                                </div>
                            </div>
                        }

                        {
                            noteItems.map((e: any) => {
                                return <ContactNoteTemplate key={e.id}
                                                            contactId={props.contactId as string} //fixme
                                                            note={e}
                                                            notifyChanged={(id: string) => {
                                                                //TODO change only the object that has changed, not reload the whole list
                                                                props.setReload(!props.reload);
                                                            }}
                                                            notifyDeleted={(id: string) => {
                                                                //TODO change only the object that has changed, not reload the whole list
                                                                props.setReload(!props.reload);
                                                            }}
                                />
                            })
                        }
                    </>
                }

            </div>
        </div>
    );
}

export default ContactNotes
