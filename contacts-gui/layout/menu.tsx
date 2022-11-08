import {useRouter} from "next/router";
import {Menu} from "primereact/menu";
import {faAddressBook, faIdCard, faUsersRectangle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";


const LayoutMenu = () => {
    const router = useRouter();

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

    return (
        <Menu model={items} className={'openline-menu'}/>
    );
}

export default LayoutMenu
