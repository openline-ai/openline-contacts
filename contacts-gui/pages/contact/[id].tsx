import {useRouter} from "next/router";
import Layout from "../../layout/layout";
import {gql, GraphQLClient} from "graphql-request";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faEdit, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {BreadCrumb} from "primereact/breadcrumb";
import {Controller, useForm} from "react-hook-form";
import {getEnumLabel} from "../../model/enums";
import {ContactTitleEnum} from "../../model/enum-contactTitle";
import {ContactTypeEnum} from "../../model/enum-contactType";
import {InputTextarea} from "primereact/inputtextarea";
import {Dialog} from "primereact/dialog";
import ContactCommunicationSection from "./contactCommunications";

function ContactDetails() {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const router = useRouter();
    const {id} = router.query;

    const [contact, setContact] = useState({
        id: undefined,
        title: '',
        firstName: '',
        lastName: '',
        label: '',
        contactType: '',
        notes: ''
    });
    const {register, handleSubmit, setValue, control} = useForm({
        defaultValues: contact
    });

    const [editDetails, setEditDetails] = useState(false);

    useEffect(() => {

        if (id !== undefined && id === 'new') {
            setEditDetails(true);
        } else if (id !== undefined && id !== 'new') {

            const query = gql`query GetContactById($id: ID!) {
                contact(id: $id) {
                    id
                    title
                    firstName
                    lastName
                    label
                    contactType
                    notes
                    emails{
                        id
                        email
                        label
                        primary
                    }
                }
            }`

            client.request(query, {id: id}).then((response: any) => {
                setContact(response.contact);
            });

        }

    }, [id]);

    const onSubmit = handleSubmit(data => {

        let query = undefined;

        if (!data.id) {
            query = gql`mutation CreateContact($contact: ContactInput!) {
                createContact(input: $contact) {
                    id
                    title
                    firstName
                    lastName
                    label
                    contactType
                    notes
                }
            }`
        } else {
            query = gql`mutation UpdateContact($contact: ContactUpdateInput!) {
                updateContact(input: $contact) {
                    id
                    title
                    firstName
                    lastName
                    label
                    contactType
                    notes
                }
            }`
        }


        client.request(query, {
            contact: data
        }).then((response) => {
                if (!data.id) {
                    setContact(response.createContact);
                } else {
                    setContact(response.updateContact);
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

    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
    const deleteContact = () => {
        const query = gql`mutation DeleteContact($id: ID!) {

            softDeleteContact(contactId: $id) {
                result
            }

        }`

        client.request(query, {id: id}).then((response: any) => {
            if (response.softDeleteContact.result) {
                router.push('/contact');
            } else {
                //TODO throw error
            }
        });
    }

    const items = [
        {label: 'Contacts', url: '/contact'}
    ];
    const home = {icon: 'pi pi-home', url: '/'}

    return (
        <Layout>

            <div className="flex p-5">

                <div className="flex-grow-0 mr-5">

                    <BreadCrumb model={items} home={home} className="pl-1"/>

                    <div className="card-fieldset" style={{width: '25rem'}}>
                        <div className="card-header">
                            <div className="flex flex-row w-full">
                                <div className="flex-grow-1">Contact details</div>
                                <div className="flex">
                                    {
                                        !editDetails &&
                                        <Button className="p-button-text p-0" onClick={() => {
                                            setValue('id', contact.id);
                                            setValue('title', contact.title);
                                            setValue('firstName', contact.firstName);
                                            setValue('lastName', contact.lastName);
                                            setValue('label', contact.label);
                                            setValue('contactType', contact.contactType);
                                            setValue('notes', contact.notes);
                                            setEditDetails(true);
                                        }}>
                                            <FontAwesomeIcon size="xs" icon={faEdit} style={{color: 'black'}}/>
                                        </Button>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="card-body">

                            {
                                !editDetails &&
                                <div className="display">
                                    <div className="grid grid-nogutter">
                                        <div className="col-4">Title</div>
                                        <div className="col-8 overflow-hidden text-overflow-ellipsis">{getEnumLabel(ContactTitleEnum, contact.title)}</div>
                                    </div>
                                    <div className="grid grid-nogutter mt-3">
                                        <div className="col-4">First name</div>
                                        <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.firstName}</div>
                                    </div>
                                    <div className="grid grid-nogutter mt-3">
                                        <div className="col-4">Last name</div>
                                        <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.lastName}</div>
                                    </div>
                                    <div className="grid grid-nogutter mt-3">
                                        <div className="col-4">Label</div>
                                        <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.label}</div>
                                    </div>
                                    <div className="grid grid-nogutter mt-3">
                                        <div className="col-4">Type</div>
                                        <div className="col-8 overflow-hidden text-overflow-ellipsis">{getEnumLabel(ContactTypeEnum, contact.contactType)}</div>
                                    </div>
                                    <div className="grid grid-nogutter mt-3">
                                        <div className="col-4">Notes</div>
                                        <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.notes}</div>
                                    </div>
                                </div>
                            }

                            {
                                editDetails &&
                                <div className="content">
                                    <form>
                                        <div className="field w-full">
                                            <label htmlFor="lastName" className="block">Title *</label>
                                            <Controller name="title" control={control} render={({field}) => (
                                                <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={ContactTitleEnum}
                                                          optionValue="value" optionLabel="label" className="w-full"/>
                                            )}/>
                                        </div>
                                        <div className="field w-full">
                                            <label htmlFor="firstName" className="block">First name *</label>
                                            <InputText id="firstName" {...register("firstName")} className="w-full"/>
                                        </div>
                                        <div className="field w-full">
                                            <label htmlFor="lastName" className="block">Last name *</label>
                                            <InputText id="lastName" {...register("lastName")} className="w-full"/>
                                        </div>
                                        <div className="field w-full">
                                            <label htmlFor="label" className="block">Label</label>
                                            <InputText id="label" {...register("label")} className="w-full"/>
                                        </div>
                                        <div className="field w-full">
                                            <label htmlFor="contactType" className="block">Type *</label>
                                            <Controller name="contactType" control={control} render={({field}) => (
                                                <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={ContactTypeEnum}
                                                          optionValue="value" optionLabel="label" className="w-full"/>
                                            )}/>
                                        </div>
                                        <div className="field w-full">
                                            <label htmlFor="notes" className="block">Notes</label>
                                            <InputTextarea id="notes" rows={2} {...register("notes")} autoResize className="w-full"/>
                                        </div>
                                    </form>

                                    <div className="flex justify-content-end">
                                        <Button onClick={(e: any) => setEditDetails(e.value)} className='p-button-link text-gray-600' label="Cancel"/>
                                        <Button onClick={() => onSubmit()} label="Save"/>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>

                    {
                        id && id !== 'new' &&
                        <ContactCommunicationSection contactId={id}/>
                    }

                    {
                        !editDetails &&
                        <>
                            <div className="flex align-items-center mt-2 ml-1">
                                <FontAwesomeIcon icon={faTrashCan} className="text-gray-600" style={{color: 'black'}}/>
                                <Button onClick={(e: any) => setDeleteConfirmationModalVisible(true)} className='p-button-link text-gray-600'
                                        label="Delete"/>
                            </div>
                            <Dialog header="Contact delete confirmation"
                                    draggable={false}
                                    visible={deleteConfirmationModalVisible}
                                    footer={
                                        <div className="flex flex-grow-1 justify-content-between align-items-center">
                                            <Button label="Delete the contact" icon="pi pi-check" onClick={() => deleteContact()} autoFocus/>
                                            <Button label="Cancel" icon="pi pi-times" onClick={() => setDeleteConfirmationModalVisible(false)} className="p-button-text"/>
                                        </div>
                                    }
                                    onHide={() => setDeleteConfirmationModalVisible(false)}>
                                <p>Please confirm that you want to delete this contact.</p>
                            </Dialog>
                        </>
                    }
                </div>

            </div>

        </Layout>
    );
}

export default ContactDetails