import {useRouter} from "next/router";
import {Button} from "primereact/button";
import {OverlayPanel} from "primereact/overlaypanel";
import {useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownShortWide, faCaretDown, faIdCard, faUserSecret, faUsersRectangle} from "@fortawesome/free-solid-svg-icons";
import {Menu} from "primereact/menu";
import {useSession} from "next-auth/react";
import AccessDenied from "../components/accessDenied";

export default function Layout({children}: any) {
    const router = useRouter();

    const userSettingsContainerRef = useRef<OverlayPanel>(null);
    const notificationsContainerRef = useRef<OverlayPanel>(null);

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
        }
    ];

    // const { data } = useSession();
    //
    // if (!data) {
    //     return (
    //             <AccessDenied />
    //     )
    // }

    return (
        <div className="flex h-full w-full">

            <div className="flex flex-column flex-grow-0 h-full text-white overflow-hidden" style={{width: '250px', background: '#100024'}}>

                <div className="flex flex-row align-items-center justify-content-between" style={{padding: '10px 10px 0px 10px',background: 'black'}}>

                    <div className="flex-grow-1">

                        <Button className="light-button" onClick={(e: any) => userSettingsContainerRef?.current?.toggle(e)}>
                            <FontAwesomeIcon icon={faUserSecret} className="mr-2"/>
                            <span>Millie Brown</span>
                            <FontAwesomeIcon icon={faCaretDown} className="ml-2"/>
                        </Button>

                        <OverlayPanel ref={userSettingsContainerRef} dismissable>
                            user settings TODO
                        </OverlayPanel>

                    </div>

                    <Button className="light-button"  style={{padding: '10px 10px'}} onClick={(e: any) => notificationsContainerRef?.current?.toggle(e)}>
                        <i className="pi pi-bell"></i>
                    </Button>

                    <OverlayPanel ref={notificationsContainerRef} dismissable>
                        notifications TODO
                    </OverlayPanel>

                </div>

                <div className="flex w-full h-full">
                    <Menu model={items} className={'openline-menu'}/>
                </div>

            </div>

            <div className="flex-grow-1 flex h-full overflow-auto">
                <div className="w-full h-full">
                    {children}
                </div>
            </div>
        </div>
    )
}