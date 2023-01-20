import type {NextPage} from 'next'

import {ContactList as ContactListComponent} from "../../components/contact/index";

const ContactList: NextPage = () => {


    return (
        <ContactListComponent fullScreenMode />
    );
}

export default ContactList
