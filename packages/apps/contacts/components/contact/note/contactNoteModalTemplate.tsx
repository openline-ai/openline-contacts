import PropTypes from "prop-types";
import {ChangeEvent, useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {toast} from "react-toastify";
import {Controller, useForm} from "react-hook-form";
import {Editor} from "primereact/editor";
import {CreateContactNote} from "../../../services/contactService";
import {UpdateNote} from "../../../services/sharedService";
import {Note} from "../../../models/contact";
import {Button} from "../../atoms";
import {useGraphQLClient} from "../../../utils/graphQLClient";

function ContactNoteModalTemplate(props: any) {
    const client = useGraphQLClient();

    const {register, handleSubmit, setValue, getValues, control, reset} = useForm({
        defaultValues: {
            id: props.note?.id || '',
            html: props.note?.html || '',
            htmlEnhanced: props.note.htmlEnhanced || ''
        }
    });

    const onSubmit = handleSubmit(d => {
        const dataToSubmit = {...d}
        dataToSubmit.html = dataToSubmit?.htmlEnhanced?.replaceAll(/.src(\S*)/g, ""); //remove src attribute to not send the file bytes in here

        if (!dataToSubmit.id) {
            CreateContactNote(client, props.contactId, dataToSubmit).then((savedNote: Note) => {
                props.notifyChanged();
                reset({
                    id: '',
                    html: '',
                    htmlEnhanced: ''
                })
                toast.success("Note added successfully!");
            }).catch((reason: any) => {

                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        } else {
            UpdateNote(client, dataToSubmit).then(() => {
                props.notifyChanged(true);
                reset({
                    id: '',
                    html: '',
                    htmlEnhanced: ''
                })
                toast.success("Note updated successfully!");
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

                })
                .catch((reason: any) => {
                    toast.error("There was a problem on our side and we are doing our best to solve it!");
                });

        }).catch((reason: any) => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });

    };

    // https://quilljs.com/docs/modules/toolbar/
    const richTextHeader = () => {
        return (
            <span className="flex justify-content-end">

                 <div className="flex flex-grow-1">
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
                 </div>

                {props.addButtonInHeader &&
                    <>
                        <div className="flex">
                            <Button onClick={onSubmit} mode="primary">
                                Add note
                            </Button>
                        </div>
                    </>
                }

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
        <div style={{display: 'flex', flexDirection: 'column', margin: props.isEdit ? '-17px -24px' : 0}}>
            <Controller name="htmlEnhanced" control={control} render={({field}) => (
                <Editor
                    style={{height: props.isEdit ? 'auto' : '120px', borderColor: props.isEdit && "transparent"}}
                    className="w-full h-full"
                    headerTemplate={richTextHeader()}
                    value={field.value}
                    onTextChange={(e) => setValue('htmlEnhanced', e.htmlValue)}
                />
            )}/>
            <div className={` flex justify-content-end  ${props.isEdit ? 'mb-3 mr-3' : 'mt-3'}`}>
                {props.isEdit ? (
                    <>
                        <Button onClick={props.notifyCancel} className={`${props.isEdit ? 'mb-3 mr-3' : ''}`}>
                            Cancel
                        </Button>
                        <Button onClick={onSubmit} mode="primary" className={`${props.isEdit ? 'mb-3 mr-3' : ''}`}>
                            Save
                        </Button>
                    </>
                ) : (
                    !props.addButtonInHeader &&
                    <>
                        <Button onClick={onSubmit} mode="primary" className={`${props.isEdit ? 'mb-3 mr-3' : ''}`}>
                            Add note
                        </Button>
                    </>
                )}

                {/*<DeleteConfirmationDialog onClick={onSubmit} mode="primary">*/}
                {/*    Send message*/}
                {/*</DeleteConfirmationDialog>*/}
            </div>


        </div>

    );
}

ContactNoteModalTemplate.propTypes = {
    contactId: PropTypes.string,
    note: PropTypes.object,
    addButtonInHeader: PropTypes.bool,
    isEdit: PropTypes.bool,
    notifyCancel: PropTypes.func,
    notifyChanged: PropTypes.func,
    notifyDeleted: PropTypes.func,
}

ContactNoteModalTemplate.defaultProps = {
    addButtonInHeader: false,
}

export default ContactNoteModalTemplate