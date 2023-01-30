import {useRouter} from "next/router";
import "@openline-ai/openline-web-chat/dist/esm/index.css"
import styles from './details-page-layout.module.scss'
import {generateGradient} from "./utils";
import React from "react";
import {IconButton} from "../../atoms/icon-button";
import {
    faEdit,
    faEnvelope,
    faMessage,
    faPhoneAlt,
    faShare,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import {Button, Divider} from "../../atoms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Props {
    onSetEditMode: (state: boolean) => void
    contact: any
}
export const ProfileLayout = ({onSetEditMode, contact }: Props) => {

    const router = useRouter();
    const userInitials = `${contact?.firstName[0] || ''}${contact?.lastName?.[0] || ''}`


    return (
            <section className={styles.profileSection}>
                {router.query.id !== 'new' ? (
                    <>
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
                                <Button onClick={() => onSetEditMode(true)} icon={faEdit}>
                                    Edit
                                </Button>
                            </div>

                            <div className={styles.quickActionRow}>
                                <IconButton disabled onClick={() => console.log('')} icon={faPhoneAlt} />
                                <IconButton disabled onClick={() => console.log('')} icon={faMessage} />
                                <IconButton disabled onClick={() => console.log('')} icon={faEnvelope} />
                                <IconButton disabled onClick={() => console.log('')} icon={faShare} />
                            </div>
                        </div>
                    </>
                   
                ) : (
                    <h2>Add new contact</h2>
                )}
            </section>

    )
}