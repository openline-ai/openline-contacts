import {useRouter} from "next/router";
import {GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {BreadCrumb} from "primereact/breadcrumb";
import {Dialog} from "primereact/dialog";
import ContactCommunicationSection from "../../components/contact/contactChannels";
import ContactOrganization from "../../components/contact/contactOrganization";
import {DeleteContact} from "../../services/contactService";
import ContactDetailsSection from "../../components/contact/contactDetailsSection";
import ContactExtensionSection from "../../components/contact/contactExtensionSection";
import {toast} from "react-toastify";
import ContactHistory from "../../components/contact/contactHistory";
import {getSession} from "next-auth/react";
import {loggedInOrRedirectToLogin} from "../../utils/logged-in";
import {TabPanel, TabView} from "primereact/tabview";
import ContactNotes from "../../components/contact/note/contactNotes";

function ContactDetails() {
    const client = new GraphQLClient(`/customer-os-api/query`);

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

    const [activeIndex, setActiveIndex] = useState(0);

    return (

        <div className="flex p-3 w-full h-full">

            <div className="flex flex-grow-0 flex-column">

                <BreadCrumb model={items} home={home} className="pl-1 mb-4"/>

                <div className="flex-grow-0 mr-5">


                    <ContactDetailsSection contactId={id as string}/>

                    {
                        id && id !== 'new' &&
                        <ContactCommunicationSection contactId={id}/>
                    }

                    {
                        id && id !== 'new' &&
                        <ContactOrganization contactId={id}/>
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

            {
                id && id !== 'new' &&
                <div className="flex flex-column flex-grow-1">
                    <div className="flex flex-grow-1">
                        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="w-full h-full">
                            <TabPanel header="Activities">
                                <ContactHistory contactId={id}/>
                            </TabPanel>
                            <TabPanel header="Notes">
                                <ContactNotes contactId={id}/>
                            </TabPanel>
                        </TabView>
                    </div>
                    <div className="flex mb-5">&nbsp;</div>
                </div>
            }

        </div>

    );
}

export async function getServerSideProps(context: any) {
    return loggedInOrRedirectToLogin(await getSession(context));
}

export default ContactDetails