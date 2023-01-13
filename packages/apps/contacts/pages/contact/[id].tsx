import {getSession} from "next-auth/react";
import {loggedInOrRedirectToLogin} from "../../utils/logged-in";
import {EditContact} from "../../components/contact";

function ContactDetails() {
    return (
        <EditContact />
    );
}

export async function getServerSideProps(context: any) {
    return loggedInOrRedirectToLogin(await getSession(context));
}

export default ContactDetails