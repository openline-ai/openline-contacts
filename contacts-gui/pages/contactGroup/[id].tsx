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

            deleteContactGroupAndUnlinkAllContacts(id: $id) {
                result
            }

        }`

        client.request(query, {id: id}).then((response: any) => {
            if (response.deleteContactGroupAndUnlinkAllContacts.result) {
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
                createContactGroup(input: $contactGroup) {
                    id
                    name
                }
            }`;
        } else {
            query = gql`mutation UpdateContact($contactGroup: ContactGroupUpdateInput!) {
                updateContactGroup(input: $contactGroup) {
                    id
                    name
                }
            }`
        }

        client.request(query, {
            contactGroup: data
        }).then((response) => {
                if (!data.id) {
                    setContactGroup(response.createContactGroup);
                } else {
                    setContactGroup(response.updateContactGroup);
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
                        <GridComponent resourceLabel={'contact'}
                                       hqlQuery="contacts"
                                       columns={
                                           [
                                               {
                                                   field: 'title',
                                                   hidden: true
                                               },
                                               {
                                                   field: 'firstName',
                                                   header: 'First name',
                                                   className: 'w50',
                                                   editLink: true
                                               },
                                               {
                                                   field: 'lastName',
                                                   header: 'Last name',
                                                   className: 'w50',
                                                   editLink: false
                                               }
                                           ]
                                       }
                                       gridTitle="Contacts in group"
                                       onEdit={(id: any) => router.push(`/contact/${id}`)}
                                       gridActions={
                                           <div>
                                               <Button onClick={(e: any) => alert('TODO')} className='p-button-link'>
                                                   <FontAwesomeIcon icon={faCirclePlus} className="mr-2"/>Add contacts to group
                                               </Button>
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