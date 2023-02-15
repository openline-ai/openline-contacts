import React from 'react';
import styles from './side-panel.module.scss'
import {AvatarButton} from "../../atoms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faSignOut} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {Sidebar} from "primereact/sidebar";
import {WebChat} from "@openline-ai/openline-web-chat";


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
            <div className={`cursor-pointer p-3 ${styles.openPanelButton} flex flex-column justify-content-between`}>
                <AvatarButton ariaLabel='Profile' onClick={isOpen ? onClose : onOpen}/>

                <WebChat apikey={`${process.env.WEB_CHAT_API_KEY}`}
                         httpServerPath={`${process.env.WEB_CHAT_HTTP_PATH}`}
                         wsServerPath={`${process.env.WEB_CHAT_WS_PATH}`}
                         location="left"
                         trackerEnabled={`${process.env.WEB_CHAT_TRACKER_ENABLED}` === 'true'}
                         trackerAppId={`${process.env.WEB_CHAT_TRACKER_APP_ID}`}
                         trackerId={`${process.env.WEB_CHAT_TRACKER_ID}`}
                         trackerCollectorUrl={`${process.env.WEB_CHAT_TRACKER_COLLECTOR_URL}`}
                         trackerBufferSize={`${process.env.WEB_CHAT_TRACKER_BUFFER_SIZE}`}
                         trackerMinimumVisitLength={`${process.env.WEB_CHAT_TRACKER_MINIMUM_VISIT_LENGTH}`}
                         trackerHeartbeatDelay={`${process.env.WEB_CHAT_TRACKER_HEARTBEAT_DELAY}`}
                         userEmail={userEmail || ''}
                />
            </div>
            <Sidebar className='globalSidebar' visible={isOpen} onHide={() => onClose()}>

                <div className={'w-full mt-5'} style={{paddingLeft:'24px'}}>
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

