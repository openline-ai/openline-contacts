import React, {useEffect, useState} from 'react';
import styles from './note.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faThumbtack, faTrash} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import {useGraphQLClient} from "../../../utils/graphQLClient";
import parse from "html-react-parser";
import ReactDOMServer from 'react-dom/server'
import {DeleteNote} from "../../../services/contactService";
import axios from "axios";
import {IconButton} from "../../atoms/icon-button";
import ContactNoteModalTemplate from "../../contact/note/contactNoteModalTemplate";
import {DeleteConfirmationDialog} from "../../atoms";
interface Props  {
    noteContent: string
    createdAt: string
    contactId?: string
    id:string
    refreshNoteData: (id: string) => void
    createdBy?: {
        firstName?: string
        lastName?: string
    }
    readonly?: boolean
}

export const NoteTimelineItem: React.FC<Props> = ({ noteContent, id, createdBy, contactId, refreshNoteData, readonly}) => {
    const client =  useGraphQLClient();
    const [images, setImages] = useState({});
    const [editNote, setEditNote] = useState(false);

    const [note, setNote] = useState({
        id,
        html: noteContent,
        htmlEnhanced: noteContent
    });

    useEffect(() => {
        if ((noteContent.match(/<img/g) || []).length > 0) {

            parse(noteContent, {
                replace: (domNode: any) => {
                    if (domNode.name === 'img' && domNode.attribs && domNode.attribs.alt) {
                        let alt = domNode.attribs.alt;

                        axios.get(`/fs/file/${alt}/base64`)
                            .then(async (response: any) => {
                                const dataUrl = response.data;

                                setImages((prevImages: any) => {
                                    const t = {} as any;
                                    t[alt] = dataUrl as string;
                                    return {
                                        ...prevImages, ...t
                                    }
                                });

                            }).catch((reason: any) => {
                            toast.error("There was a problem on our side and we are doing our best to solve it!");
                        });
                    }
                }
            });

        } else {
            setNote({id, html: noteContent, htmlEnhanced: noteContent});
        }

    }, [id, noteContent]);

    useEffect(() => {
        const imagesToLoad = (noteContent.match(/<img/g) || []).length;
        if (imagesToLoad > 0 && Object.keys(images).length === imagesToLoad) {

            const htmlParsed = parse(noteContent, {
                replace: (domNode: any) => {
                    if (domNode.name === 'img' && domNode.attribs && domNode.attribs.alt) {

                        // @ts-ignore
                        const imageSrc = images[domNode.attribs.alt] as string;
                        return <img src={imageSrc} alt={domNode.attribs.alt} style={{width: '200px'}}/>
                    }
                }
            });

            const html = ReactDOMServer.renderToString(htmlParsed as any);

            setNote({
                id,
                html: noteContent,
                htmlEnhanced: html
            });
        }

    }, [id, images, noteContent]);

    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
    const deleteNote = () => {
        DeleteNote(client, contactId, id).then((result: boolean) => {
            if (result) {
                refreshNoteData(id);
                setDeleteConfirmationModalVisible(false);
                toast.success("Note removed successfully!");
            } else {
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            }
        }).catch((reason: any) => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }

    const canEditNote = editNote && !readonly

    return (
        <>
            {
                canEditNote &&
                <ContactNoteModalTemplate
                    isEdit
                    note={note}
                    contactId={contactId}
                    notifyChanged={(data) => {
                        setEditNote(false);
                        refreshNoteData(data);
                    }}
                    notifyCancel={() => setEditNote(false)}
                />
            }
            <DeleteConfirmationDialog
                deleteConfirmationModalVisible={deleteConfirmationModalVisible}
                setDeleteConfirmationModalVisible={setDeleteConfirmationModalVisible}
                deleteAction={deleteNote}
                confirmationButtonLabel="Delete note"
            />


            {!editNote && (
                <div className={styles.noteContainer}>
                    <FontAwesomeIcon icon={faThumbtack}  className={styles.pin}/>
                    <div className={`${styles.noteContent}`} dangerouslySetInnerHTML={{__html: note.htmlEnhanced}}></div>
                    <div className={styles.noteData}>
                        <div className="text-sm text-gray-600"> {createdBy?.firstName} {" "} {createdBy?.lastName}</div>
                    </div>

                    {!readonly && (
                        <div className={styles.actions}>
                            <IconButton onClick={() => setDeleteConfirmationModalVisible(true)}
                                        icon={faTrash}
                                        mode="secondary"
                                        ariaLabel="Delete"
                                        style={{marginRight: 0, marginBottom: '8px', height: '1rem'}}/>

                            <IconButton onClick={() => setEditNote(true)}
                                        icon={faEdit}
                                        mode="secondary"
                                        ariaLabel="Edit"
                                        style={{marginRight: 0, height: '1rem'}}/>
                        </div>
                    )}

                </div>
            )}
    </>
    )

};

