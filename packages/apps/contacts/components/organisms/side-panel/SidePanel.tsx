import React, {useState} from 'react';
import styles from './side-panel.module.scss'
import {AvatarButton} from "../../atoms";
import {signOut} from "next-auth/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOut} from "@fortawesome/free-solid-svg-icons";


interface Props {
    user: any;
}

export const SidePanel: React.FC<Props> = ({ user}) => {
    const [isSidePanelVisible, setSidePanelVisible] = useState(false);

    return (
        <div className={styles.panelWrapper} style={{background: isSidePanelVisible ? "white" : "transparent"}}>
            <div className={styles.openPanelButton}>
                    <AvatarButton ariaLabel='Profile' onClick={() => setSidePanelVisible(!isSidePanelVisible)} />
            </div>

            <div className={`${isSidePanelVisible ? styles.panelIsOpen : styles.panelClosed} ${styles.panel}`}>
                    <div className={`${styles.content} ${isSidePanelVisible ? styles.contentVisible : styles.contentHidden}`}>
                        <div className={styles.userDataSection}>
                            <div className={styles.userDataEntry}>
                        <span>
                            Email:
                        </span>
                                {user.user.email}
                            </div>
                        </div>
                        <div className={styles.signOutSection}>
                            <button className={styles.signOutButton} onClick={() => signOut()}>
                                <FontAwesomeIcon icon={faSignOut} />
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

