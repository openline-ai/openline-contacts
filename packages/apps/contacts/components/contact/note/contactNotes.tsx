import PropTypes, {string} from "prop-types";
import {useEffect, useState} from "react";
import {GraphQLClient} from "graphql-request";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {PaginatedResponse} from "../../../utils/pagination";
import {Button} from "primereact/button";
import {toast} from "react-toastify";
import {GetContactNotes} from "../../../services/contactService";
import {Note} from "../../../models/contact";
import {Skeleton} from "primereact/skeleton";
import ContactNoteTemplate from "./contactNoteTemplate";
import ContactNoteModalTemplate from "./contactNoteModalTemplate";

function ContactNotes(props: any) {
    const client = new GraphQLClient(`/customer-os-api/query`);

    const [noteTotalElements, setNoteTotalElements] = useState(0);
    const [noteItems, setNoteItems] = useState([] as any);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [addNewNote, setAddNewNote] = useState(false);

    useEffect(() => {
        if (props.contactId) {
            loadNotes();
        }
    }, [props.contactId, reload]);

    const loadNotes = () => {
        setLoading(true);
        //todo add pagination
        GetContactNotes(client, props.contactId, {page: 0, limit: 100}).then(async (result: PaginatedResponse<Note>) => {
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

                        <div className="flex flex-grow-1 align-items-center w-full bg-white border-dark-1 p-3 mt-3">

                            <div className="flex flex-grow-1">
                                Total notes: {noteTotalElements}
                            </div>

                            <div className="flex flex-grow-0 align-items-center" onClick={() => {
                                setAddNewNote(!addNewNote);
                            }}>
                                <FontAwesomeIcon icon={faPlusCircle} className="text-gray-600" style={{color: 'black'}}/>
                                <Button className='p-button-link text-gray-600' label="Add note"/>
                            </div>
                            {
                                addNewNote &&
                                <ContactNoteModalTemplate
                                    note={{
                                        id: undefined,
                                        html: ''
                                    }}
                                    contactId={props.contactId}
                                    notifyChanged={(data: any) => {
                                        setAddNewNote(false);
                                        setReload(!reload); // TODO add the new node to the array. do not reload everything
                                    }}
                                    notifyCancel={() => {
                                        setAddNewNote(false);
                                    }}
                                />
                            }

                        </div>

                        {
                            noteItems.length == 0 &&
                            <div className="flex">
                                <div className="flex flex-grow-1 p-2 bg-white border-dark-1 mt-3">
                                    No notes added yet
                                </div>
                            </div>
                        }

                        {
                            noteItems.map((e: any) => {
                                return <ContactNoteTemplate key={e.id}
                                                            contactId={props.contactId}
                                                            note={e}
                                                            notifyChanged={(id: string) => {
                                                                //TODO change only the object that has changed, not reload the whole list
                                                                setReload(!reload);
                                                            }}
                                                            notifyDeleted={(id: string) => {
                                                                //TODO change only the object that has changed, not reload the whole list
                                                                setReload(!reload);
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

ContactNotes.propTypes = {
    contactId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(string)
    ]) || undefined,
    className: PropTypes.arrayOf(string)
}

export default ContactNotes
