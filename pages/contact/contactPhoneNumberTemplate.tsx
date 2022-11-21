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
import {Checkbox} from "primereact/checkbox";
import {PhoneNumberLabelEnum} from "../../model/enum-phoneNumberlLabel";

function ContactPhoneNumberTemplate(props: any) {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

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
                } else {
                    props.notifySave({...response.phoneNumberUpdateInContact, ...{uiKey: data.uiKey}});
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

    const [deletePhoneNumberConfirmationModalVisible, setDeletePhoneNumberConfirmationModalVisible] = useState(false);
    const deletePhoneNumber = () => {
        //todo show loading
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
                //todo show notification

                props.notifyDelete(props.phoneNumber.uiKey);

                setDeletePhoneNumberConfirmationModalVisible(false);

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
                            Number: {props.phoneNumber.e164}<br/>
                            Label: {props.phoneNumber.label}
                            {props.phoneNumber.primary ? <><br/> Primary</> : ''}
                        </div>
                        <div className="col-4">

                            <Button className="p-button-text p-0" onClick={(e: any) => {
                                setValue('id', props.phoneNumber.id);
                                setValue('e164', props.phoneNumber.e164);
                                setValue('label', props.phoneNumber.label);
                                setValue('primary', props.phoneNumber.primary);
                                setEditDetails(true);
                            }}>
                                <FontAwesomeIcon size="xs" icon={faEdit} style={{color: 'black'}}/>
                            </Button>

                            <Button className="p-button-text p-0" onClick={(e: any) => setDeletePhoneNumberConfirmationModalVisible(true)}>
                                <FontAwesomeIcon size="xs" icon={faTrashCan} style={{color: 'black'}}/>
                            </Button>
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
                    </div>
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