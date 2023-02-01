import React, {useState} from 'react';
import styles from './side-panel.module.scss'
import {AvatarButton} from "../../atoms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faSignOut} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";


interface Props {
    userEmail: any;
    logoutUrl: string | undefined;
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const SidePanel: React.FC<Props> = ({userEmail, logoutUrl, isOpen, onOpen, onClose}) => {
    const router = useRouter();

    return (
        <div className={`${styles.panelWrapper} ${isOpen ? styles.open : ''} ' `} style={{background: isOpen ? "white" : "transparent"}}>
            <div className={styles.openPanelButton} >
                <AvatarButton ariaLabel='Profile' onClick={isOpen ? onClose : onOpen} />
            </div>
            <div className={`${isOpen ? styles.panelIsOpen : styles.panelClosed} ${styles.panel}`}>
                <div className={`${isOpen ? styles.contentVisible : styles.contentHidden}`}>
                    <div className={styles.userDataSection}>
                        <div className={styles.userDataEntry}>
                            <span>
                                Email:
                            </span>
                            {userEmail}
                        </div>
                    </div>
                    <div className={styles.signOutSection}>
                        <button className={styles.signOutButton} onClick={() => router.push('/settings')}>
                            <FontAwesomeIcon icon={faCog}/>
                            <span>
                                    Settings
                                </span>
                        </button>
                        <button className={styles.signOutButton} onClick={() => window.location.href = logoutUrl ?? '#'}>
                            <FontAwesomeIcon icon={faSignOut}/>
                            <span>
                                    Log out
                                </span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

