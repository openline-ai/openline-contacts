import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {Skeleton} from "primereact/skeleton";
import parse from "html-react-parser";
import {toast} from "react-toastify";
import ReactDOMServer from 'react-dom/server'
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {DeleteNote} from "../../../services/contactService";
import {GraphQLClient} from "graphql-request";
import ContactNoteModalTemplate from "./contactNoteModalTemplate";
import axios from "axios";

function ContactNoteTemplate(props: any) {
    const client = new GraphQLClient(`/customer-os-api/query`);

    const [images, setImages] = useState({});
    const [editNote, setEditNote] = useState(false);

    const [note, setNote] = useState({
        id: undefined,
        html: "",
        htmlEnhanced: ""
    });

    useEffect(() => {

        if ((props.note.html.match(/<img/g) || []).length > 0) {

            parse(props.note.html, {
                replace: (domNode: any) => {
                    if (domNode.name === 'img' && domNode.attribs && domNode.attribs.alt) {
                        let alt = domNode.attribs.alt;

                        axios.get(`/fs/file/${alt}/base64`)
                            .then(async (response: any) => {
                                var dataUrl = response.data;

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
            setNote({...props.note, ...{htmlEnhanced: props.note.html}});
        }

    }, [props.note]);

    useEffect(() => {

        const imagesToLoad = (props.note.html.match(/<img/g) || []).length;

        if (imagesToLoad > 0 && Object.keys(images).length === imagesToLoad) {

            let htmlParsed = parse(props.note.html, {
                replace: (domNode: any) => {
                    if (domNode.name === 'img' && domNode.attribs && domNode.attribs.alt) {

                        // @ts-ignore
                        const imageSrc = images[domNode.attribs.alt] as string;
                        return <img src={imageSrc} alt={domNode.attribs.alt} style={{width: '200px'}}/>
                    }
                }
            });

            let html = ReactDOMServer.renderToString(htmlParsed as any);

            setNote({
                id: props.note.id,
                html: props.note.html,
                htmlEnhanced: html
            });
        }

    }, [images]);

    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
    const deleteNote = () => {
        DeleteNote(client, props.contactId, props.note.id).then((result: boolean) => {
            if (result) {
                props.notifyDeleted(props.note.id);
                setDeleteConfirmationModalVisible(false);
                toast.success("Note removed successfully!");
            } else {
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            }
        }).catch((reason: any) => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }

    return (
        <>

            {
                editNote &&
                <ContactNoteModalTemplate
                    note={note}
                    contactId={props.contactId}
                    notifyChanged={(data) => {
                        setEditNote(false);
                        props.notifyChanged(data);
                    }}
                    notifyCancel={() => setEditNote(false)}
                />
            }

            <Dialog header="Contact note delete confirmation"
                    draggable={false}
                    visible={deleteConfirmationModalVisible}
                    footer={
                        <div className="flex flex-grow-1 justify-content-between align-items-center">
                            <Button label="Delete the contact note" icon="pi pi-check" onClick={() => deleteNote()} autoFocus/>
                            <Button label="Cancel" icon="pi pi-times" onClick={() => setDeleteConfirmationModalVisible(false)} className="p-button-text"/>
                        </div>
                    }
                    onHide={() => setDeleteConfirmationModalVisible(false)}>
                <p>Please confirm that you want to delete this contact note.</p>
            </Dialog>

            <div className="flex align-items-center w-full mt-3 p-3 bg-white border-dark-1">

                {
                    !note.id &&
                    <>
                        <div className="flex flex-column flex-grow-1">
                            <Skeleton className="w-full mt-3" height="0.5rem"/>
                            <Skeleton className="w-full mt-3" height="0.5rem"/>
                            <Skeleton className="w-full mt-3" height="0.5rem"/>
                        </div>
                    </>
                }

                {
                    note.id &&
                    <>
                        <div className="flex flex-grow-1">
                            <div className="w-full h-full" dangerouslySetInnerHTML={{__html: note.htmlEnhanced}}></div>
                        </div>

                        <div className="flex flex-grow-0">

                            <div className="flex flex-grow-0 align-items-center mr-2 cursor-pointer" onClick={() => {
                                setEditNote(true);
                            }}>
                                <FontAwesomeIcon icon={faEdit} className="text-gray-600" style={{color: 'black'}}/>
                            </div>

                            <div className="cursor-pointer" onClick={() => setDeleteConfirmationModalVisible(true)}>
                                <FontAwesomeIcon icon={faTrashCan} className="text-gray-600" style={{color: 'black'}}/>
                            </div>
                        </div>
                    </>
                }

            </div>
        </>
    );
}

ContactNoteTemplate.propTypes = {
    contactId: PropTypes.string,
    note: PropTypes.object,
    add: PropTypes.number,
    notifyHtmlChanged: PropTypes.func,
    notifyChanged: PropTypes.func,
    notifyDeleted: PropTypes.func,
}

export default ContactNoteTemplate