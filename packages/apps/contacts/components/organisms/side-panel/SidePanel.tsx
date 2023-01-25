import React, {useState} from 'react';
import styles from './side-panel.module.scss'
import {AvatarButton} from "../../atoms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faSignOut} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";


interface Props {
    userEmail: any;
    logoutUrl: string | undefined;
}

export const SidePanel: React.FC<Props> = ({userEmail, logoutUrl}) => {
    const [isSidePanelVisible, setSidePanelVisible] = useState(false);
    const router = useRouter();

    return (
        <div className={styles.panelWrapper} style={{background: isSidePanelVisible ? "white" : "transparent"}}>
            <div className={styles.openPanelButton}>
                <AvatarButton ariaLabel='Profile' onClick={() => setSidePanelVisible(!isSidePanelVisible)}/>
            </div>

            <div className={`${isSidePanelVisible ? styles.panelIsOpen : styles.panelClosed} ${styles.panel}`}>
                <div className={`${styles.content} ${isSidePanelVisible ? styles.contentVisible : styles.contentHidden}`}>
                    <div className={styles.userDataSection}>
                        <div className={styles.userDataEntry}>
                            <div>
                                Email:
                            </div>
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

