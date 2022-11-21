import {useRouter} from "next/router";
import Layout from "../../layout/layout";
import {gql, GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faEdit, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {InputText} from "primereact/inputtext";
import {useForm} from "react-hook-form";
import GridComponent from "../../components/GridComponent";
import {BreadCrumb} from "primereact/breadcrumb";
import {Dialog} from "primereact/dialog";
import {getEnumLabel} from "../../model/enums";
import {ContactTitleEnum} from "../../model/enum-contactTitle";
import SearchComponent from "../../components/SearchComponent";

function ContactGroupEdit() {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const [contactGroup, setContactGroup] = useState({
        id: undefined,
        name: ''
    });
    const [editDetails, setEditDetails] = useState(false);

    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {

        if (id !== undefined && id === 'new') {
            setEditDetails(true);
        } else if (id !== undefined && id !== 'new') {

            const query = gql`query GetContactGroupById($id: ID!) {
                contactGroup(id: $id) {
                    id
                    name
                    contacts{
                        content{
                            id
                            firstName
                            lastName
                            title
                        }
                        totalPages
                        totalElements
                    }
                }
            }`

            client.request(query, {id: id}).then((response: any) => {
                setValue('id', response.contactGroup.id);
                setValue('name', response.contactGroup.name);
                setContactGroup(response.contactGroup);
            });

        }

    }, [id]);

    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
    const deleteContactGroup = () => {
        const query = gql`mutation DeleteContactGroup($id: ID!) {
            contactGroupDeleteAndUnlinkAllContacts(id: $id) {
                result
            }
        }`

        client.request(query, {id: id}).then((response: any) => {
            if (response.contactGroupDeleteAndUnlinkAllContacts.result) {
                router.push('/contactGroup');
            } else {
                //TODO throw error
            }
        });
    }

    const {register, handleSubmit, setValue} = useForm({
        defaultValues: contactGroup
    });

    const onSubmit = handleSubmit(data => {

        let query = undefined;

        if (!data.id) {
            query = gql`mutation CreateContactGroup($contactGroup: ContactGroupInput!) {
                contactGroupCreate(input: $contactGroup) {
                    id
                    name
                }
            }`;
        } else {
            query = gql`mutation UpdateContact($contactGroup: ContactGroupUpdateInput!) {
                contactGroupUpdate(input: $contactGroup) {
                    id
                    name
                }
            }`
        }

        client.request(query, {
            contactGroup: data
        }).then((response) => {
                if (!data.id) {
                    setContactGroup(response.contactGroupCreate);
                } else {
                    setContactGroup(response.contactGroupUpdate);
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

    });

    const [contactsInGroupReload, setContactsInGroupReload] = useState(false);
    const loadContactsInGroup = function (params: any) {
        return new Promise((resolve, reject) => {

            //TODO add pagination
            //https://github.com/openline-ai/openline-customer-os/issues/288
            const query = gql`query GetContactInGroup($id: ID!) {
                contactGroup(id: $id) {
                    contacts{
                        content{
                            id
                            firstName
                            lastName
                            title
                        }
                        totalPages
                        totalElements
                    }
                }
            }`

            client.request(query, {
                id: id
            }).then((response: any) => {
                if (response.contactGroup) {
                    resolve({
                        content: response.contactGroup.contacts.content,
                        totalElements: response.contactGroup.contacts.totalElements
                    });
                } else {
                    resolve({
                        error: response
                    });
                }
            });
        });
    }

    const searchContactForAddingInGroup = function () {
        return new Promise((resolve, reject) => {
            const query = gql`query GetContacts($pagination: Pagination){
                contacts(pagination: $pagination){
                    content {
                        id
                        firstName
                        lastName
                        title
                    }
                    totalPages
                    totalElements
                }
            }`

            client.request(query, {
                pagination: {
                    "page": 0,
                    "limit": 25
                }
            }).then((response: any) => {
                if (response.contacts.content) {
                    resolve({
                        content: response.contacts.content,
                        totalElements: response.contacts.totalElements
                    });
                } else {
                    resolve({
                        error: response
                    });
                }
            });
        });
    }

    const addContactToGroup = function (contact: any) {
        return new Promise((resolve, reject) => {
            const query = gql`mutation AddContactToGroup($groupId: ID!, $contactId:ID!) {
                contactGroupAddContact(groupId: $groupId, contactId: $contactId) {
                    result
                }
            }`

            client.request(query, {
                groupId: id,
                contactId: contact.id
            }).then((response: any) => {
                if (response.contactGroupAddContact) {
                    setContactsInGroupReload(!contactsInGroupReload);
                } else {
                    resolve({
                        error: response
                    });
                }
            });
        });
    }

    const removeContactFromGroup = function (contact: any) {
        return new Promise((resolve, reject) => {
            const query = gql`mutation RemoveContactFromGroup($groupId: ID!, $contactId:ID!) {
                contactGroupRemoveContact(groupId: $groupId, contactId: $contactId) {
                    result
                }
            }`

            client.request(query, {
                groupId: id,
                contactId: contact.id
            }).then((response: any) => {
                if (response.contactGroupRemoveContact) {
                    setContactsInGroupReload(!contactsInGroupReload);
                } else {
                    resolve({
                        error: response
                    });
                }
            });
        });
    }

    const items = [
        {label: 'Contact groups', url: '/contactGroup'}
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
                                <div className="flex-grow-1">Contact group details</div>
                                <div className="flex">
                                    {
                                        !editDetails &&
                                        <Button className="p-button-text p-0" onClick={() => {
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
                                        <div className="col-4">Name</div>
                                        <div
                                            className="col-8 overflow-hidden text-overflow-ellipsis">{contactGroup.name}</div>
                                    </div>
                                </div>
                            }

                            {
                                editDetails &&
                                <div className="content">
                                    <form onSubmit={onSubmit}>
                                        <div className="field w-full">
                                            <label htmlFor="name" className="block">Name *</label>
                                            <InputText id="name" autoFocus {...register("name")} className="w-full"/>
                                        </div>
                                    </form>

                                    <div className="flex justify-content-end">
                                        <Button onClick={(e: any) => setEditDetails(e.value)}
                                                className='p-button-link text-gray-600'
                                                label="Cancel"/>
                                        <Button onClick={() => onSubmit()} label="Save"/>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>

                    {
                        !editDetails &&
                        <>
                            <div className="flex align-items-center mt-2 ml-1">
                                <FontAwesomeIcon icon={faTrashCan} className="text-gray-600" style={{color: 'black'}}/>
                                <Button onClick={(e: any) => setDeleteConfirmationModalVisible(true)} className='p-button-link text-gray-600'
                                        label="Delete"/>
                            </div>
                            <Dialog header="Contact group delete confirmation"
                                    draggable={false}
                                    visible={deleteConfirmationModalVisible}
                                    footer={
                                        <div className="flex flex-grow-1 justify-content-between align-items-center">
                                            <Button label="Delete the contact group" icon="pi pi-check" onClick={() => deleteContactGroup()} autoFocus/>
                                            <Button label="Cancel" icon="pi pi-times" onClick={() => setDeleteConfirmationModalVisible(false)} className="p-button-text"/>
                                        </div>
                                    }
                                    onHide={() => setDeleteConfirmationModalVisible(false)}>
                                <p>Please confirm that you want to delete this contact group.</p>
                                <p>The contacts will not be changed, but the associations to this group will be removed.</p>
                            </Dialog>
                        </>
                    }
                </div>

                {
                    contactGroup.id &&
                    <div className="flex-grow-1">
                        <GridComponent
                            gridTitle="Contacts in group"
                            sortingEnabled={false}
                            filtersEnabled={false}
                            configurationEnabled={false}
                            columns={
                                [
                                    {
                                        className: 'w50',
                                        label: 'Contact',
                                        template: (c: any) => {
                                            return <div key={c.id}>
                                                {getEnumLabel(ContactTitleEnum, c.title)}&nbsp;{c.firstName}&nbsp;{c.lastName}

                                                &nbsp;&nbsp;
                                                <FontAwesomeIcon icon={faTrashCan} className="text-gray-600" style={{color: 'black'}} onClick={() => removeContactFromGroup(c)}/>
                                            </div>
                                        }
                                    }
                                ]
                            }
                            queryData={(params: any) => loadContactsInGroup(params)}
                            triggerReload={contactsInGroupReload}
                            gridActions={
                                <div className="flex align-items-center">

                                    <SearchComponent
                                        triggerType={"button"}
                                        buttonLabel="Add a contact to group"
                                        buttonIcon={faCirclePlus}
                                        searchBy={[{label: 'Name', field: 'firstName'}]}
                                        searchData={(name: string, maxResults: string) => {
                                            return searchContactForAddingInGroup();
                                        }}
                                        itemTemplate={(e: any) => {
                                            return <span>
                                                            <span className="mr-3">{e.firstName} {e.lastName}</span>
                                                            <span className="mr-3">{e.email}</span>
                                                        </span>
                                        }}
                                        onItemSelected={(e: any) => addContactToGroup(e)}
                                        maxResults={2}/>

                                </div>
                            }
                        />
                    </div>
                }

            </div>

        </Layout>
    );
}

export default ContactGroupEdit