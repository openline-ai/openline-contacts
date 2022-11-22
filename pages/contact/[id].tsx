import {useRouter} from "next/router";
import Layout from "../../layout/layout";
import {gql, GraphQLClient} from "graphql-request";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrashCan, faUser, faUserNinja} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {BreadCrumb} from "primereact/breadcrumb";
import {Controller, useForm} from "react-hook-form";
import {getEnumLabel} from "../../model/enums";
import {ContactTitleEnum} from "../../model/enum-contactTitle";
import {InputTextarea} from "primereact/inputtextarea";
import {Dialog} from "primereact/dialog";
import ContactCommunicationSection from "../../components/contact/contactCommunications";
import ContactCompaniesPositions from "../../components/contact/contactCompaniesPositions";
import SearchComponent from "../../components/generic/SearchComponent";
import ContactExtension from "../../components/contact/contactExtension";

function ContactDetails() {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const router = useRouter();
    const {id} = router.query;

    const [contact, setContact] = useState({
        id: undefined,
        title: '',
        firstName: '',
        lastName: '',
        ownerId: undefined,
        ownerFullName: '',
        contactTypeId: undefined,
        contactTypeName: '',
        label: '',
        notes: ''
    });
    const {register, handleSubmit, setValue, control} = useForm({
        defaultValues: contact
    });

    const [contactTypeList, setContactTypeList] = useState([] as any);
    const [editDetails, setEditDetails] = useState(false);

    useEffect(() => {
        if (id !== undefined) {
            const queryContactTypes = gql`query GetContactTypeList {
                contactTypes {
                    id
                    name
                }
            }`

            client.request(queryContactTypes).then((response: any) => {
                setContactTypeList(response.contactTypes);
            });
        }

        if (id !== undefined && id === 'new') {
            setEditDetails(true);
        } else if (id !== undefined && id !== 'new') {

            const query = gql`query GetContactById($id: ID!) {
                contact(id: $id) {
                    id
                    title
                    firstName
                    lastName
                    owner{
                        id
                        firstName
                        lastName
                    }
                    contactType{
                        id
                        name
                    }
                    label
                    notes
                }
            }`

            client.request(query, {id: id}).then((response: any) => {
                setContact(getContactObjectFromResponse(response.contact));
            });

        }

    }, [id]);

    const getContactObjectFromResponse = (contact: any) => {
        return {
            id: contact.id,
            title: contact.title,
            firstName: contact.firstName,
            lastName: contact.lastName,
            ownerId: contact.owner?.id ?? undefined,
            ownerFullName: contact.owner ? contact.owner.firstName + ' ' + contact.owner.lastName : '',
            contactTypeId: contact.contactType?.id ?? undefined,
            contactTypeName: contact.contactType?.name ?? '',
            label: contact.label,
            notes: contact.notes
        };
    }

    const onSubmit = handleSubmit(data => {

        let query = undefined;

        if (!data.id) {
            query = gql`mutation CreateContact($contact: ContactInput!) {
                contact_Create(input: $contact) {
                    id
                    title
                    firstName
                    lastName
                    owner{
                        id
                        firstName
                        lastName
                    }
                    contactType{
                        id
                        name
                    }
                    label
                    notes
                }
            }`
        } else {
            query = gql`mutation UpdateContact($contact: ContactUpdateInput!) {
                contact_Update(input: $contact) {
                    id
                    title
                    firstName
                    lastName
                    owner{
                        id
                        firstName
                        lastName
                    }
                    contactType{
                        id
                        name
                    }
                    label
                    notes
                }
            }`
        }


        client.request(query, {
            contact: {
                id: data.id,
                title: data.title,
                firstName: data.firstName,
                lastName: data.lastName,
                contactTypeId: data.contactTypeId,
                ownerId: data.ownerId,
                label: data.label,
                notes: data.notes,
            }
        }).then((response) => {
                if (!data.id) {
                    router.push('/contact/' + response.contact_Create.id)
                } else {
                    setContact(getContactObjectFromResponse(response.contact_Update));
                }
                setEditDetails(false);
            }
        ).catch((reason) => {
            console.log(reason);
            if (reason.response.status === 400) {
                // reason.response.data.errors.forEach((error: any) => {
                //     formik.setFieldError(error.field, error.message);
                // })
                //todo show errors on form
            } else {
                alert('error');
            }
        });

    });

    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
    const deleteContact = () => {
        const query = gql`mutation DeleteContact($id: ID!) {
            contact_SoftDelete(contactId: $id) {
                result
            }
        }`

        client.request(query, {id: id}).then((response: any) => {
            if (response.contact_SoftDelete.result) {
                router.push('/contact');
            } else {
                //TODO throw error
            }
        });
    }

    const searchOwner = function (where: any, maxResults: string) {
        return new Promise((resolve, reject) => {

            const query = gql`query SearchOwner ($pagination: Pagination!, $where: Filter) {
                users(pagination: $pagination, where: $where){
                    content{
                        id
                        firstName
                        lastName
                        email
                    }
                    totalPages
                    totalElements
                }
            }`

            //TODO https://github.com/openline-ai/openline-contacts/issues/77
            //when filters are available on BE
            client.request(query, {
                pagination: {
                    "page": 0,
                    "limit": maxResults
                },
                where: where
            }).then((response: any) => {
                if (response.users.content) {
                    resolve({
                        content: response.users.content,
                        totalElements: response.users.totalElements
                    });
                } else {
                    resolve({
                        error: response
                    });
                }
            });
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
                                            setValue('ownerId', contact.ownerId);
                                            setValue('ownerFullName', contact.ownerFullName);
                                            setValue('contactTypeId', contact.contactTypeId);
                                            setValue('label', contact.label);
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
                                        <div className="col-4">Owner</div>
                                        <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.ownerFullName}</div>
                                    </div>
                                    <div className="grid grid-nogutter mt-3">
                                        <div className="col-4">Type</div>
                                        <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.contactTypeName}</div>
                                    </div>
                                    <div className="grid grid-nogutter mt-3">
                                        <div className="col-4">Label</div>
                                        <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.label}</div>
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
                                            <label htmlFor="ownerFullName" className="block">Owner</label>
                                            <Controller name="ownerFullName" control={control} render={({field}) => (
                                                <SearchComponent
                                                    resourceLabel="users"
                                                    value={field.value}
                                                    searchBy={[{label: 'First name', field: 'FIRST_NAME'}, {label: 'Last name', field: 'LAST_NAME'}]}
                                                    searchData={(where: any, maxResults: string) => {
                                                        return searchOwner(where, maxResults);
                                                    }}
                                                    itemTemplate={(e: any) => {
                                                        return <>
                                                            <span className="mr-3"><FontAwesomeIcon icon={faUserNinja}/></span>
                                                            <span className="mr-3">{e.firstName} {e.lastName}</span>
                                                        </>
                                                    }}
                                                    onItemSelected={(e: any) => {
                                                        setValue('ownerId', !e ? undefined : e.id);
                                                        setValue('ownerFullName', !e ? 'empty' : (e.firstName + ' ' + e.lastName));
                                                    }}
                                                    maxResults={5}/>
                                            )}/>
                                        </div>
                                        <div className="field w-full">
                                            <label htmlFor="contactTypeId" className="block">Type</label>
                                            <Controller name="contactTypeId" control={control} render={({field}) => (
                                                <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={contactTypeList}
                                                          optionValue="id" optionLabel="name" className="w-full"/>
                                            )}/>
                                        </div>
                                        <div className="field w-full">
                                            <label htmlFor="label" className="block">Label</label>
                                            <InputText id="label" {...register("label")} className="w-full"/>
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
                        id && id !== 'new' &&
                        <ContactCompaniesPositions contactId={id}/>
                    }

                    {/*{*/}
                    {/*    id && id !== 'new' &&*/}
                    {/*    <ContactExtension contactId={id}/>*/}
                    {/*}*/}

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