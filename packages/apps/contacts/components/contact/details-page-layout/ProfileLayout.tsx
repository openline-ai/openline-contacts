import {useRouter} from "next/router";
import "@openline-ai/openline-web-chat/dist/esm/index.css"
import styles from './details-page-layout.module.scss'
import {generateGradient} from "./utils";
import React, {useState} from "react";
import {IconButton} from "../../atoms/icon-button";
import {
    faEdit,
    faEnvelope,
    faMessage,
    faPhoneAlt,
    faShare,
    faTrashCan,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import {DeleteConfirmationDialog} from "../../atoms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {DeleteContact} from "../../../services/contactService";
import {toast} from "react-toastify";
import {useGraphQLClient} from "../../../utils/graphQLClient";
import {TagsList} from "../../atoms/tag-input/TagInput";

interface Props {
    onSetEditMode: (state: boolean) => void
    contact: any
}
export const ProfileLayout = ({onSetEditMode, contact }: Props) => {
    const client =  useGraphQLClient();
    const router = useRouter();
    const userInitials = `${contact?.firstName[0] || ''}${contact?.lastName?.[0] || ''}`
    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
    const deleteContact = () => {
        DeleteContact(client, contact.id).then((result: boolean) => {
            if (result) {
                router.push('/');
                toast.success("Contact removed successfully!");
            } else {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            }
        }).catch((reason: any) => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }

    return (
            <section className={styles.profileSection}>
                {router.query.id !== 'new' ? (
                    <div style={{display: 'flex'}}>
                        <div className={styles.avatar} style={{background: generateGradient()}}>
                            {userInitials.length ? userInitials : (
                                <FontAwesomeIcon icon={faUser} />
                            )}
                        </div>
                        <div className={styles.userDataSection}>
                            <div className='flex align-items-center justify-content-between'>
                                <div className={styles.profileUserData}>
                                    <span>
                                        {contact.firstName || 'Unknown'}
                                    </span>
                                    {contact.lastName}
                                </div>
                                <div className="flex">
                                    <IconButton
                                        ariaLabel="Edit"
                                        style={{marginRight: 0}}
                                        onClick={() => onSetEditMode(true)}
                                        icon={faEdit}/>
                                    <IconButton
                                        ariaLabel="Delete"
                                        onClick={()=> setDeleteConfirmationModalVisible(true)}
                                        icon={faTrashCan}/>
                                </div>
                            </div>
                            <div className="flex mb-2">
                                    <span className={styles.dataSourceLabel}>
                                        Source:
                                    </span>

                                    <div className={styles.dataSource}>
                                        {contact?.source || 'unknown'}
                                    </div>

                            </div>

                            <div className={styles.quickActionRow}>
                                <IconButton disabled onClick={() => console.log('')} icon={faPhoneAlt} />
                                <IconButton disabled onClick={() => console.log('')} icon={faMessage} />
                                <IconButton disabled onClick={() => console.log('')} icon={faEnvelope} />
                                <IconButton disabled onClick={() => console.log('')} icon={faShare} />
                            </div>


                        </div>
                    </div>
                   
                ) : (
                    <h2>Add new contact</h2>
                )}
                <div>
                    <TagsList tags={contact?.tags} readOnly />
                </div>

                <DeleteConfirmationDialog
                    header="Delete Contact"
                    deleteConfirmationModalVisible={deleteConfirmationModalVisible}
                    setDeleteConfirmationModalVisible={setDeleteConfirmationModalVisible}
                    deleteAction={deleteContact}
                    confirmationButtonLabel="Delete contact"
                    explanationText={(
                        <>
                            <p>Please confirm that you want to delete this contact.</p>
                            <p>This action cannot be undone. </p>
                        </>
                    )}
                />

            </section>

    )
}