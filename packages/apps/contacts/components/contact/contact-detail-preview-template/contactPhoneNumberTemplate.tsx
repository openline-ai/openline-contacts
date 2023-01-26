import {Controller, useForm} from "react-hook-form";
import PropTypes from "prop-types";
import {useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {faEdit, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {Checkbox} from "primereact/checkbox";
import {PhoneNumberLabelEnum} from "../../../model/enum-phoneNumberlLabel";
import {toast} from "react-toastify";
import styles from "./contact-detail-preview.module.scss";
import {IconButton} from "../../atoms/icon-button";
import {useGraphQLClient} from "../../../utils/graphQLClient";
function ContactPhoneNumberTemplate(props: any) {
    const client =  useGraphQLClient();

    const {register, setValue, handleSubmit, control} = useForm({
        defaultValues: props.phoneNumber
    });

    const onSubmit = handleSubmit((data: any) => {

        let query = undefined;

        if (!data.id) {
            query = gql`mutation AddPhoneNumberToContact($contactId: ID!, $phoneNumber: PhoneNumberInput!) {
                phoneNumberMergeToContact(contactId: $contactId, input: $phoneNumber) {
                    id
                    e164
                    label
                    primary
                }
            }`
        } else {
            query = gql`mutation UpdatePhoneNumberForContact($contactId: ID!, $phoneNumber: PhoneNumberUpdateInput!) {
                phoneNumberUpdateInContact(contactId: $contactId, input: $phoneNumber) {
                    id
                    e164
                    label
                    primary
                }
            }`
        }

        client.request(query, {
            contactId: props.contactId,
            phoneNumber: {
                id: data.id,
                e164: data.e164,
                label: data.label,
                primary: data.primary
            }
        }).then((response) => {
                if (!data.id) {
                    props.notifySave({...response.phoneNumberMergeToContact, ...{uiKey: data.uiKey}});
                    toast.success("Phone number added successfully!");
                } else {
                    props.notifySave({...response.phoneNumberUpdateInContact, ...{uiKey: data.uiKey}});
                    toast.success("Phone number updated successfully!");
                }
                setEditDetails(false);
            }
        ).catch((reason: any) => {
            //todo log an error in server side
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    })

    const [deletePhoneNumberConfirmationModalVisible, setDeletePhoneNumberConfirmationModalVisible] = useState(false);
    const deletePhoneNumber = () => {
        const query = gql`mutation DeletePhoneNumberForContact($contactId: ID!, $e164: String!) {
            phoneNumberDeleteFromContact(contactId: $contactId, e164: $e164) {
                result
            }
        }`

        client.request(query, {
            contactId: props.contactId,
            e164: props.phoneNumber.e164
        }).then((response: any) => {
            if (response.phoneNumberDeleteFromContact.result) {
                toast.success("Phone number removed successfully!");
                props.notifyDelete(props.phoneNumber.uiKey);
                setDeletePhoneNumberConfirmationModalVisible(false);
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
                                {props.phoneNumber.label}
                            </div>
                            <div className={styles.contactDetail}>
                                {/*<FontAwesomeIcon icon={faPhone} className={styles.contactDetailIcon} />*/}
                                {props.phoneNumber.e164}
                            </div>
                       
                            <div className={styles.contactDetail}>
                                {props.phoneNumber.primary ?  <>Primary</> : ''}
                            </div>



                        </div>
                        <div className='flex'>
                            <div className="mr-3">
                                <IconButton
                                    className="p-button-text p-0"
                                    onClick={(e: any) => {
                                        setValue('id', props.phoneNumber.id);
                                        setValue('e164', props.phoneNumber.e164);
                                        setValue('label', props.phoneNumber.label);
                                        setValue('primary', props.phoneNumber.primary);
                                        setEditDetails(true);
                                    }}
                                    icon={faEdit}
                                />
                            </div>
                            <div>
                                <IconButton
                                    className="p-button-text p-0"
                                    onClick={() => setDeletePhoneNumberConfirmationModalVisible(true)}
                                    icon={faTrashCan}
                                />
                            </div>
                        </div>
                   

                        
                            <Dialog header="Phone number delete confirmation"
                                    draggable={false}
                                    visible={deletePhoneNumberConfirmationModalVisible}
                                    footer={
                                        <div className="flex flex-grow-1 justify-content-between align-items-center">
                                            <Button label="Delete the phone number" icon="pi pi-check" onClick={() => deletePhoneNumber()} autoFocus/>
                                            <Button label="Cancel" icon="pi pi-times" onClick={() => setDeletePhoneNumberConfirmationModalVisible(false)} className="p-button-text"/>
                                        </div>
                                    }
                                    onHide={() => setDeletePhoneNumberConfirmationModalVisible(false)}>
                                <p>Please confirm that you want to delete this phone number.</p>
                            </Dialog>

                        </div>
            }

            {
                editDetails &&
                <div className="content">
                    <form>
                        <div className="field w-full">
                            <label htmlFor="e164" className="block">Number *</label>
                            <InputText id="e164" {...register("e164")} className="w-full"/>
                        </div>
                        <div className="field w-full">
                            <label htmlFor="label" className="block">Label *</label>
                            <Controller name="label" control={control} render={({field}) => (
                                <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={PhoneNumberLabelEnum}
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
                        <Button onClick={(e: any) => notifyCancelEdit(props.phoneNumber.uiKey)} className='p-button-link text-gray-600' label="Cancel"/>
                        <Button onClick={() => onSubmit()} label="Save"/>
                    </div>
                </div>
            }
        </>
    );
}

ContactPhoneNumberTemplate.propTypes = {
    contactId: PropTypes.string,
    phoneNumber: PropTypes.object,
    initialEditState: PropTypes.bool,
    notifySave: PropTypes.func,
    notifyDelete: PropTypes.func,
    notifyCancelEdit: PropTypes.func
}

ContactPhoneNumberTemplate.defaultValues = {
    initialEditState: false,
    notifySave: () => {
    },
    notifyDelete: () => {
    },
    notifyCancelEdit: () => {
    }
}

export default ContactPhoneNumberTemplate