import {Controller, useForm} from "react-hook-form";
import PropTypes from "prop-types";
import React, {useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faEnvelope, faPhone, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {EmailLabelEnum} from "../../../model/enum-emailLabel";
import {Checkbox} from "primereact/checkbox";
import {toast} from "react-toastify";
import {IconButton} from "../../atoms/icon-button";
import {Button} from "../../atoms/button";
import styles from './contact-detail-preview.module.scss'
import {useGraphQLClient} from "../../../utils/graphQLClient";
import {DeleteConfirmationDialog} from "../../atoms";
function ContactEmailTemplate(props: any) {
    const client =  useGraphQLClient();

    const {register, setValue, handleSubmit, control} = useForm({
        defaultValues: props.email
    });

    const onSubmit = handleSubmit((data: any) => {

        let query = undefined;

        if (!data.id) {
            query = gql`mutation AddEmailToContact($contactId: ID!, $email: EmailInput!) {
                emailMergeToContact(contactId: $contactId, input: $email) {
                    id
                    email
                    label
                    primary
                }
            }`
        } else {
            query = gql`mutation UpdateEmailForContact($contactId: ID!, $email: EmailUpdateInput!) {
                emailUpdateInContact(contactId: $contactId, input: $email) {
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
                    props.notifySave({...response.emailMergeToContact, ...{uiKey: data.uiKey}});
                    toast.success("Email added successfully!");
                } else {
                    props.notifySave({...response.emailUpdateInContact, ...{uiKey: data.uiKey}});
                    toast.success("Email updated successfully!");
                }
                setEditDetails(false);
            }
        ).catch((reason: any) => {
            //todo log an error in server side
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    });

    const [deleteEmailConfirmationModalVisible, setDeleteEmailConfirmationModalVisible] = useState(false);
    const deleteEmail = () => {

        const query = gql`mutation DeleteEmail($contactId: ID!, $email: String!) {
            emailRemoveFromContact(contactId: $contactId, email: $email) {
                result
            }
        }`

        client.request(query, {
            contactId: props.contactId,
            email: props.email.email
        }).then((response: any) => {
            if (response.emailRemoveFromContact.result) {
                toast.success("Email removed successfully!");
                props.notifyDelete(props.email.uiKey);
                setDeleteEmailConfirmationModalVisible(false);
            } else {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            }
        }).catch((reason: any) => {
            //todo log an error in server side
            toast.error("There was a problem on our side and we are doing our best to solve it!");
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
                <div className={styles.contactDetailsContainer}>
                    <div>
                        <div className={styles.contactDetailLabel}>
                            {props.email.label}
                        </div>
                        <div className={styles.contactDetail}>
                            {props.email.email}
                        </div>       
                     
                        <div className={styles.contactDetail}>
                            {props.email.primary ?  <>Primary</> : ''}
                        </div>
                    </div>
                            <div className='flex'>
                                <div className="mr-3">
                                    <IconButton
                                        mode="secondary"
                                        className="p-button-text p-0"
                                        onClick={(e: any) => {
                                            setValue('id', props.email.id);
                                            setValue('email', props.email.email);
                                            setValue('label', props.email.label);
                                            setValue('primary', props.email.primary);
                                            setEditDetails(true);
                                        }}
                                        icon={faEdit}
                                    />
                                </div>
                                <div>
                                    <IconButton
                                        className="p-button-text p-0"
                                        mode="secondary"
                                        onClick={() => setDeleteEmailConfirmationModalVisible(true)}
                                        icon={faTrashCan}
                                    />
                                </div>
                            </div>

                            <DeleteConfirmationDialog
                                deleteConfirmationModalVisible={deleteEmailConfirmationModalVisible}
                                setDeleteConfirmationModalVisible={setDeleteEmailConfirmationModalVisible}
                                deleteAction={deleteEmail}
                                confirmationButtonLabel="Delete email address"
                            />
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
                        <Button
                                onClick={(e: any) => notifyCancelEdit(props.email.uiKey)}
                                className='p-button-link  text-gray-600'>
                            Cancel
                        </Button>
                        <Button onClick={() => onSubmit()} mode="primary"> Save </Button>
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