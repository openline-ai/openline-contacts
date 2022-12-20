import PropTypes, {string} from "prop-types";
import {useEffect, useState} from "react";
import {GraphQLClient} from "graphql-request";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlusCircle, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {PaginatedResponse} from "../../utils/pagination";
import {Button} from "primereact/button";
import {toast} from "react-toastify";
import {CreateContactNote, DeleteNote, GetContactNotes, UpdateContactNote} from "../../services/contactService";
import {Note} from "../../models/contact";
import {Skeleton} from "primereact/skeleton";
import {Dialog} from "primereact/dialog";
import {useForm} from "react-hook-form";
import {InputTextarea} from "primereact/inputtextarea";

function ContactNotes(props: any) {
    const client = new GraphQLClient(`/customer-os-api/query`);

    const [noteTotalElements, setNoteTotalElements] = useState(0);
    const [noteItems, setNoteItems] = useState([] as any);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [editNoteModalVisible, setEditNoteModalVisible] = useState(false);

    useEffect(() => {
        if (props.contactId) {
            loadNotes();
        }
    }, [props.contactId, reload]);

    const loadNotes = () => {
        setLoading(true);
        //todo add pagination
        GetContactNotes(client, props.contactId, {page: 0, limit: 100}).then((result: PaginatedResponse<Note>) => {
            console.log(result)
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

    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
    const deleteNote = (noteId: string) => {
        DeleteNote(client, props.contactId, noteId).then((result: boolean) => {
            if (result) {
                setReload(!reload);
                setDeleteConfirmationModalVisible(false);
                toast.success("Note removed successfully!");
            } else {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            }
        }).catch((reason: any) => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }

    const [note, setNote] = useState({
        id: undefined,
        text: ''
    }) as any;
    const {register, handleSubmit, setValue} = useForm();
    const onSubmit = handleSubmit(data => {
        if (!data.id) {
            CreateContactNote(client, props.contactId, data).then((savedNote: Note) => {
                setReload(!reload);
                setEditNoteModalVisible(false);
                toast.success("Contact note added successfully!");
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        } else {
            UpdateContactNote(client, props.contactId, data).then((savedNote: Note) => {
                setReload(!reload);
                setEditNoteModalVisible(false);
                toast.success("Contact note updated successfully!");
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }
    });
    return (
        <div className='w-full h-full'>
            <div>

                <Dialog header={note.id ? 'Edit note' : 'Add note'}
                        style={{width: '500px'}}
                        draggable={false}
                        visible={editNoteModalVisible}
                        footer={
                            <div className="flex flex-grow-1 justify-content-between align-items-center">
                                <Button label={note.id ? 'Update note' : 'Add note'} icon="pi pi-check" onClick={() => onSubmit()}/>
                                <Button label="Cancel" icon="pi pi-times" onClick={() => setEditNoteModalVisible(false)} className="p-button-text"/>
                            </div>
                        }
                        onHide={() => setEditNoteModalVisible(false)}>

                    <form onSubmit={onSubmit}>
                        <InputTextarea id="text" {...register("text")} className="w-full" rows={10}/>
                    </form>
                </Dialog>

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
                                setNote({});
                                setValue('id', undefined);
                                setValue('text', '');
                                setEditNoteModalVisible(true);
                            }}>
                                <FontAwesomeIcon icon={faPlusCircle} className="text-gray-600" style={{color: 'black'}}/>
                                <Button className='p-button-link text-gray-600' label="Add note"/>
                            </div>

                        </div>

                        {
                            noteItems.length == 0 &&
                            <div className="flex">
                                <div className="flex flex-grow-1 p-2 bg-white border-dark-1">
                                    No notes added yet
                                </div>
                            </div>
                        }

                        {
                            noteItems.map((e: any) => {
                                return <div key={e.id} className="flex align-items-center w-full mt-3 p-3 bg-white border-dark-1" style={{}}>

                                    <div className="flex flex-grow-1">
                                        {e.text}
                                    </div>

                                    <div className="flex flex-grow-0">

                                        <div className="flex flex-grow-0 align-items-center mr-2 cursor-pointer" onClick={() => {
                                            setNote(e);
                                            setValue('id', e.id);
                                            setValue('text', e.text);
                                            setEditNoteModalVisible(true);
                                        }}>
                                            <FontAwesomeIcon icon={faEdit} className="text-gray-600" style={{color: 'black'}}/>
                                        </div>

                                        <div className="cursor-pointer" onClick={() => {
                                            setNote(e);
                                            setDeleteConfirmationModalVisible(true);
                                        }}>
                                            <FontAwesomeIcon icon={faTrashCan} className="text-gray-600" style={{color: 'black'}}/>
                                        </div>
                                    </div>
                                </div>
                            })
                        }

                        <Dialog header="Contact note delete confirmation"
                                draggable={false}
                                visible={deleteConfirmationModalVisible}
                                footer={
                                    <div className="flex flex-grow-1 justify-content-between align-items-center">
                                        <Button label="Delete the contact note" icon="pi pi-check" onClick={() => deleteNote(note.id)} autoFocus/>
                                        <Button label="Cancel" icon="pi pi-times" onClick={() => setDeleteConfirmationModalVisible(false)} className="p-button-text"/>
                                    </div>
                                }
                                onHide={() => setDeleteConfirmationModalVisible(false)}>
                            <p>Please confirm that you want to delete this contact note.</p>
                        </Dialog>
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
