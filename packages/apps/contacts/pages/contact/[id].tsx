import {useRouter} from "next/router";
import Layout from "../../layout/layout";
import {GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {BreadCrumb} from "primereact/breadcrumb";
import {Dialog} from "primereact/dialog";
import ContactCommunicationSection from "../../components/contact/contactCommunications";
import ContactCompaniesPositions from "../../components/contact/contactCompaniesPositions";
import {DeleteContact} from "../../services/contactService";
import ContactDetailsSection from "../../components/contact/contactDetailsSection";
import ContactExtensionSection from "../../components/contact/contactExtensionSection";
import {toast} from "react-toastify";

function ContactDetails() {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const router = useRouter();
    const {id} = router.query;

    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
    const deleteContact = () => {
        DeleteContact(client, id).then((result: boolean) => {
            if (result) {
                router.push('/contact');
                toast.success("Contact removed successfully!");
            } else {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            }
        }).catch((reason: any) => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }

    const items = [
        {label: 'Contacts', url: '/contact'}
    ];
    const home = {icon: 'pi pi-home', url: '/'}

    return (

            <div className="flex p-5">

                <div className="flex-grow-0 mr-5">

                    <BreadCrumb model={items} home={home} className="pl-1"/>

                    <ContactDetailsSection contactId={id as string}/>

                    {
                        id && id !== 'new' &&
                        <ContactCommunicationSection contactId={id}/>
                    }

                    {
                        id && id !== 'new' &&
                        <ContactCompaniesPositions contactId={id}/>
                    }

                    {
                        id && id !== 'new' &&
                        <ContactExtensionSection contactId={id}/>
                    }

                    {
                        id && id !== 'new' &&
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

    );
}

export default ContactDetails