import {Controller, useForm} from "react-hook-form";
import PropTypes from "prop-types";
import {useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {EmailLabelEnum} from "../../model/enum-emailLabel";
import {Checkbox} from "primereact/checkbox";

function ContactEmailTemplate(props: any) {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const {register, setValue, handleSubmit, control} = useForm({
        defaultValues: props.email
    });

    const onSubmit = handleSubmit((data: any) => {

        let query = undefined;

        if (!data.id) {
            query = gql`mutation AddEmailToContact($contactId: ID!, $email: EmailInput!) {
                mergeEmailToContact(contactId: $contactId, input: $email) {
                    id
                    email
                    label
                    primary
                }
            }`
        } else {
            query = gql`mutation UpdateEmailForContact($contactId: ID!, $email: EmailUpdateInput!) {
                updateEmailInContact(contactId: $contactId, input: $email) {
                    id
                    email
                    label
                    primary
                }
            }`
        }

        client.request(query, {
            contactId: props.contactId,
            email: {
                id: data.id,
                email: data.email,
                label: data.label,
                primary: data.primary
            }
        }).then((response) => {
                if (!data.id) {
                    props.notifySave({...response.mergeEmailToContact, ...{uiKey: data.uiKey}});
                } else {
                    props.notifySave({...response.updateEmailInContact, ...{uiKey: data.uiKey}});
                }
                setEditDetails(false);
            }
        ).catch((reason) => {
            if (reason.response.status === 400) {
                // reason.response.data.errors.forEach((error: any) => {
                //     formik.setFieldError(error.field, error.message);
                // })
                //todo show errors on form
            } else {
                alert('error');
            }
        });

    })

    const [deleteEmailConfirmationModalVisible, setDeleteEmailConfirmationModalVisible] = useState(false);
    const deleteEmail = () => {
        //todo show loading
        const query = gql`mutation DeleteEmail($contactId: ID!, $email: String!) {
            removeEmailFromContact(contactId: $contactId, email: $email) {
                result
            }
        }`

        client.request(query, {
            contactId: props.contactId,
            email: props.email.email
        }).then((response: any) => {
            if (response.removeEmailFromContact.result) {
                //todo show notification

                props.notifyDelete(props.email.uiKey);

                setDeleteEmailConfirmationModalVisible(false);

            } else {
                //TODO throw error
            }
        });
    }
    const notifyCancelEdit = (uiKey: string) => {
        setEditDetails(false);
        props.notifyCancelEdit(uiKey);
    }

    const [editDetails, setEditDetails] = useState(props.initialEditState ?? false);

    return (
        <>
            {
                !editDetails &&
                <div className="display">
                    <div className="grid grid-nogutter mt-3">
                        <div className="col-8">
                            Email: {props.email.email}<br/>
                            Label: {props.email.label}
                            {props.email.primary ? <><br/> Primary</> : ''}
                        </div>
                        <div className="col-4">

                            <Button className="p-button-text p-0" onClick={(e: any) => {
                                setValue('id', props.email.id);
                                setValue('email', props.email.email);
                                setValue('label', props.email.label);
                                setValue('primary', props.email.primary);
                                setEditDetails(true);
                            }}>
                                <FontAwesomeIcon size="xs" icon={faEdit} style={{color: 'black'}}/>
                            </Button>

                            <Button className="p-button-text p-0" onClick={(e: any) => setDeleteEmailConfirmationModalVisible(true)}>
                                <FontAwesomeIcon size="xs" icon={faTrashCan} style={{color: 'black'}}/>
                            </Button>
                            <Dialog header="Email delete confirmation"
                                    draggable={false}
                                    visible={deleteEmailConfirmationModalVisible}
                                    footer={
                                        <div className="flex flex-grow-1 justify-content-between align-items-center">
                                            <Button label="Delete the email address" icon="pi pi-check" onClick={() => deleteEmail()} autoFocus/>
                                            <Button label="Cancel" icon="pi pi-times" onClick={() => setDeleteEmailConfirmationModalVisible(false)} className="p-button-text"/>
                                        </div>
                                    }
                                    onHide={() => setDeleteEmailConfirmationModalVisible(false)}>
                                <p>Please confirm that you want to delete this email address.</p>
                            </Dialog>

                        </div>
                    </div>
                </div>
            }

            {
                editDetails &&
                <div className="content">
                    <form>
                        <div className="field w-full">
                            <label htmlFor="email" className="block">Email *</label>
                            <InputText id="email" {...register("email")} className="w-full"/>
                        </div>
                        <div className="field w-full">
                            <label htmlFor="label" className="block">Label *</label>
                            <Controller name="label" control={control} render={({field}) => (
                                <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={EmailLabelEnum}
                                          optionValue="value" optionLabel="label" className="w-full"/>
                            )}/>
                        </div>
                        <div className="field w-full">
                            <label htmlFor="primary" className="block">Primary</label>
                            <Controller name="primary" control={control} render={({field}) => (
                                <Checkbox id="primary" onChange={e => field.onChange(e.checked)} checked={field.value}/>
                            )}/>
                        </div>
                    </form>

                    <div className="flex justify-content-end">
                        <Button onClick={(e: any) => notifyCancelEdit(props.email.uiKey)} className='p-button-link text-gray-600' label="Cancel"/>
                        <Button onClick={() => onSubmit()} label="Save"/>
                    </div>
                </div>
            }
        </>
    );
}

ContactEmailTemplate.propTypes = {
    contactId: PropTypes.string,
    email: PropTypes.object,
    initialEditState: PropTypes.bool,
    notifySave: PropTypes.func,
    notifyDelete: PropTypes.func,
    notifyCancelEdit: PropTypes.func
}

ContactEmailTemplate.defaultValues = {
    initialEditState: false,
    notifySave: () => {
    },
    notifyDelete: () => {
    },
    notifyCancelEdit: () => {
    }
}

export default ContactEmailTemplate