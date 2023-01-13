import {useRouter} from "next/router";
import {GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {Dialog} from "primereact/dialog";
import ContactCommunicationSection from "../contactChannels";
import ContactOrganization from "../contactOrganization";
import ContactDetailsSection from "../contactDetailsSection";
import ContactExtensionSection from "../contactExtensionSection";
import {toast} from "react-toastify";
import ContactHistory from "../contactHistory";
import {TabPanel, TabView} from "primereact/tabview";
import ContactNotes from "../note/contactNotes";
import {FullScreenModeLayout} from "../../organisms/fullscreen-mode-layout";
import {DeleteContact} from "../../../services/contactService";
import styles from './edit-contact.module.scss'
export function EditContact() {
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

    const [activeIndex, setActiveIndex] = useState(0);

    return (

        <FullScreenModeLayout fullScreenMode classNames={styles.editContactPage}>
            {/*{*/}
            {/*    id && id !== 'new' &&*/}
            {/*    <>*/}
            {/*        <div className="flex align-items-center mt-2 ml-1">*/}
            {/*            <FontAwesomeIcon icon={faTrashCan} className="text-gray-600" style={{color: 'black'}}/>*/}
            {/*            <Button onClick={(e: any) => setDeleteConfirmationModalVisible(true)} className='p-button-link text-gray-600'*/}
            {/*                    label="Delete"/>*/}
            {/*        </div>*/}
            {/*        <Dialog header="Contact delete confirmation"*/}
            {/*                draggable={false}*/}
            {/*                visible={deleteConfirmationModalVisible}*/}
            {/*                footer={*/}
            {/*                    <div className="flex flex-grow-1 justify-content-between align-items-center">*/}
            {/*                        <Button label="Delete the contact" icon="pi pi-check" onClick={() => deleteContact()} autoFocus/>*/}
            {/*                        <Button label="Cancel" icon="pi pi-times" onClick={() => setDeleteConfirmationModalVisible(false)} className="p-button-text"/>*/}
            {/*                    </div>*/}
            {/*                }*/}
            {/*                onHide={() => setDeleteConfirmationModalVisible(false)}>*/}
            {/*            <p>Please confirm that you want to delete this contact.</p>*/}
            {/*        </Dialog>*/}
            {/*    </>*/}
            {/*}*/}

            <div className={styles.editContactGrid}>
                <div className={styles.detailsArea}>
                    <ContactDetailsSection contactId={id as string}/>
                </div>

                {
                    id && id !== 'new' &&
                    <div className={styles.communicationArea}>
                        <ContactCommunicationSection contactId={id}/>
                    </div>
                }

                {
                    id && id !== 'new' &&
                    <div className={styles.organisationArea}>
                        <ContactOrganization contactId={id}/>

                    </div>
                }

                {/*{*/}
                {/*    id && id !== 'new' &&*/}

                {/*    <ContactExtensionSection contactId={id}/>*/}
                {/*}*/}




                {
                    id && id !== 'new' &&
                    <div className={`flex flex-column flex-grow-1 ${styles.tabArea}`} style={{width: '100%'}}>
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

        </FullScreenModeLayout>

    );
}

