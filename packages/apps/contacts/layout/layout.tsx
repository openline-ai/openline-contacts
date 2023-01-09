import {useRouter} from "next/router";
import {Button} from "primereact/button";
import {OverlayPanel} from "primereact/overlaypanel";
import {useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faCaretDown, faIdCard, faSitemap, faUserSecret, faUsersRectangle} from "@fortawesome/free-solid-svg-icons";
import {Menu} from "primereact/menu";
import {signOut, useSession} from "next-auth/react";
import {WebChat} from "@openline-ai/openline-web-chat";
import "@openline-ai/openline-web-chat/dist/esm/index.css"

export default function Layout({children}: any) {
    const router = useRouter();

    const {data: session} = useSession();

    const userSettingsContainerRef = useRef<OverlayPanel>(null);
    const notificationsContainerRef = useRef<OverlayPanel>(null);

    let userItems = [
        {
            label: 'My profile',
            icon: <FontAwesomeIcon icon={faUserSecret} className="mr-2"/>,
            command: () => {
                router.push('/');
            }
        },
        {
            label: 'Logout',
            icon: <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2"/>,
            command: () => {
                signOut();
            }
        }
    ];

    let items = [
        {
            label: 'Contacts',
            icon: <FontAwesomeIcon icon={faIdCard} className="mr-2"/>,
            className: router.pathname.split('/')[1] === 'contact' ? 'selected' : '',
            command: () => {
                router.push('/contact');
            }
        },
        {
            label: 'Contact groups',
            icon: <FontAwesomeIcon icon={faUsersRectangle} className="mr-2"/>,
            className: router.pathname.split('/')[1] === 'contactGroup' ? 'selected' : '',
            command: () => {
                router.push('/contactGroup');
            }
        },
        {
            label: 'Organizations',
            icon: <FontAwesomeIcon icon={faSitemap} className="mr-2"/>,
            className: router.pathname.split('/')[1] === 'organization' ? 'selected' : '',
            command: () => {
                router.push('/organization');
            }
        }
    ];

    return (
        <div className="flex h-full w-full">

            <div className="flex flex-column flex-grow-0 h-full text-white overflow-hidden" style={{width: '250px', background: '#100024'}}>

                <div className="flex flex-row align-items-center justify-content-between" style={{padding: '10px 10px 0px 10px', background: 'black'}}>

                    <div className="flex-grow-1">

                        <Button className="light-button" onClick={(e: any) => userSettingsContainerRef?.current?.toggle(e)}>
                            <FontAwesomeIcon icon={faUserSecret} className="mr-2"/>
                            <span>{session?.user?.email}</span>
                            <FontAwesomeIcon icon={faCaretDown} className="ml-2"/>
                        </Button>

                        <OverlayPanel ref={userSettingsContainerRef} dismissable>
                            <Menu model={userItems} style={{border: 'none'}}/>
                        </OverlayPanel>

                    </div>

                    <Button className="light-button" style={{padding: '10px 10px'}} onClick={(e: any) => notificationsContainerRef?.current?.toggle(e)}>
                        <i className="pi pi-bell"></i>
                    </Button>

                    <OverlayPanel ref={notificationsContainerRef} dismissable>
                        notifications TODO
                    </OverlayPanel>

                </div>

                <nav className="flex w-full h-full">
                    <Menu model={items} className={'openline-menu'}/>
                </nav>

            </div>

            <div className="flex-grow-1 flex h-full overflow-auto">
                <div className="w-full h-full">
                    {children}
                </div>
            </div>

            <WebChat apikey={`${process.env.WEB_CHAT_API_KEY}`}
                     httpServerPath={`${process.env.WEB_CHAT_HTTP_PATH}`}
                     wsServerPath={`${process.env.WEB_CHAT_WS_PATH}`}
                     trackerEnabled={`${process.env.WEB_CHAT_TRACKER_ENABLED}` === 'true'}
                     trackerAppId={`${process.env.WEB_CHAT_TRACKER_APP_ID}`}
                     trackerId={`${process.env.WEB_CHAT_TRACKER_ID}`}
                     trackerCollectorUrl={`${process.env.WEB_CHAT_TRACKER_COLLECTOR_URL}`}
                     trackerBufferSize={`${process.env.WEB_CHAT_TRACKER_BUFFER_SIZE}`}
                     trackerMinimumVisitLength={`${process.env.WEB_CHAT_TRACKER_MINIMUM_VISIT_LENGTH}`}
                     trackerHeartbeatDelay={`${process.env.WEB_CHAT_TRACKER_HEARTBEAT_DELAY}`}
                     userEmail={session?.user?.email || ''}
                     location='left'
            />
        </div>
    )
}