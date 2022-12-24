import PropTypes from "prop-types";
import {ChangeEvent, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {toast} from "react-toastify";
import {Button} from "primereact/button";
import {Controller, useForm} from "react-hook-form";
import {Editor} from "primereact/editor";
import {Dialog} from "primereact/dialog";
import {CreateContactNote, UpdateContactNote} from "../../../services/contactService";
import {GraphQLClient} from "graphql-request";
import {Note} from "../../../models/contact";

function ContactNoteModalTemplate(props: any) {
    const client = new GraphQLClient(`/customer-os-api/query`);

    const {register, handleSubmit, setValue, getValues, control} = useForm({
        defaultValues: {
            id: props.note.id,
            html: props.note.html,
            htmlEnhanced: props.note.htmlEnhanced
        }
    });

    const onSubmit = handleSubmit(d => {
        const dataToSubmit = {...d}
        console.log(dataToSubmit.html)
        console.log(dataToSubmit.htmlEnhanced)
        dataToSubmit.html = dataToSubmit.htmlEnhanced.replaceAll(/.src(\S*)/g, ""); //remove src attribute to not send the file bytes in here
        console.log(dataToSubmit.html)

        if (!dataToSubmit.id) {
            CreateContactNote(client, props.contactId, dataToSubmit).then((savedNote: Note) => {
                props.notifyChanged(savedNote);
                toast.success("Contact note added successfully!");
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        } else {
            UpdateContactNote(client, props.contactId, dataToSubmit).then((savedNote: Note) => {
                props.notifyChanged(savedNote);
                toast.success("Contact note updated successfully!");
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }
    });

    const inputRef = useRef<HTMLInputElement | null>(null);
    const handleUploadClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        axios.post(`/fs/file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((r: any) => {

            fetch(`/fs/file/${r.data.id}/download`)
                .then(async (response: any) => {

                    let blob = await response.blob();

                    var reader = new FileReader();
                    reader.onload = function () {
                        var dataUrl = reader.result as any;

                        if (dataUrl) {
                            setValue('htmlEnhanced', getValues("htmlEnhanced") + `<img width="400" src='${dataUrl}' alt='${r.data.id}'>`)
                        } else {
                            toast.error("There was a problem on our side and we are doing our best to solve it!");
                        }
                    };
                    reader.readAsDataURL(blob);

                }).catch((reason: any) => {
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });

        }).catch((reason: any) => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });

    };

    // https://quilljs.com/docs/modules/toolbar/
    const richTextHeader = () => {
        return (
            <span className="ql-formats">

                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-strike" aria-label="Strike"></button>

                <button className="ql-link" aria-label="Link"></button>
                <button className="ql-code-block" aria-label="Code block"></button>
                <button className="ql-blockquote" aria-label="Blockquote"></button>

                <button id="custom-button" type={"button"} aria-label="Insert picture" onClick={() => handleUploadClick()}>
                    <FontAwesomeIcon size="xs" icon={faImage} style={{color: '#6c757d'}}/>
                </button>

                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    style={{display: 'none'}}
                />

            </span>
        );
    }

    return (
        <Dialog header={props.note.id ? 'Edit note' : 'Add note'}
                style={{width: '700px'}}
                visible={true}
                draggable={false}
                footer={
                    <div className="flex flex-grow-1 justify-content-between align-items-center">
                        <Button label={props.note.id ? 'Update note' : 'Add note'} icon="pi pi-check" onClick={() => onSubmit()}/>
                        <Button label="Cancel" icon="pi pi-times" onClick={() => props.notifyCancel()} className="p-button-text"/>
                    </div>
                }
                onHide={() => props.notifyCancel()}>

            <Controller name="htmlEnhanced" control={control} render={({field}) => (
                <Editor style={{height: '300px'}}
                        className="w-full"
                        headerTemplate={richTextHeader()}
                        value={field.value} onTextChange={(e) => setValue('htmlEnhanced', e.htmlValue)}
                />
            )}/>

        </Dialog>
    );
}

ContactNoteModalTemplate.propTypes = {
    contactId: PropTypes.string,
    note: PropTypes.object,
    add: PropTypes.number,
    notifyCancel: PropTypes.func,
    notifyChanged: PropTypes.func,
    notifyDeleted: PropTypes.func,
}

export default ContactNoteModalTemplate