import React from 'react';
import styles from './side-panel.module.scss'
import {AvatarButton} from "../../atoms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faSignOut} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {Sidebar} from "primereact/sidebar";


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
        <>
            <div className={`mt-3 ml-3 cursor-pointer ${styles.openPanelButton}`}>
                <AvatarButton ariaLabel='Profile' onClick={isOpen ? onClose : onOpen}/>
            </div>
            <Sidebar className='globalSidebar' visible={isOpen} onHide={() => onClose()}>

                <div className={'w-full mt-5'} style={{marginLeft:'24px'}}>
                    Hi there!
                </div>

                <div className={'mt-3'}>
                    <button className={styles.signOutButton} onClick={() => {
                        onClose();
                        router.push('/settings');
                    }}>
                        <FontAwesomeIcon icon={faCog}/> Settings
                    </button>
                    <button className={styles.signOutButton} onClick={() => window.location.href = logoutUrl ?? '#'}>
                        <FontAwesomeIcon icon={faSignOut}/> Log out
                    </button>
                </div>

            </Sidebar>
        </>
    );
};

