import {useRouter} from "next/router";
import {GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronCircleLeft, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {BreadCrumb} from "primereact/breadcrumb";
import {Dialog} from "primereact/dialog";
import ContactCommunicationSection from "../../components/contact/contactChannels";
import ContactOrganization from "../../components/contact/contactOrganization";
import {DeleteContact} from "../../services/contactService";
import ContactDetailsSection from "../../components/contact/contactDetailsSection";
import ContactExtensionSection from "../../components/contact/contactExtensionSection";
import {toast} from "react-toastify";
import ContactHistory from "../../components/contact/contactHistory";
import {getSession} from "next-auth/react";
import {loggedInOrRedirectToLogin} from "../../utils/logged-in";
import {TabPanel, TabView} from "primereact/tabview";
import ContactNotes from "../../components/contact/note/contactNotes";
import {EditContact} from "../../components/contact";

function ContactDetails() {
    const client = new GraphQLClient(`/customer-os-api/query`);

    const router = useRouter();
    const {id} = router.query;

    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
    const deleteContact = () => {
        DeleteContact(client, id).then((result: boolean) => {
            if (result) {
                router.push('/contact');
                toast.success("Contact removed successfully!");
            } else {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            }
        }).catch((reason: any) => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }

    const items = [
        {label: 'Contacts', url: '/contact'}
    ];
    const home = {icon: 'pi pi-home', url: '/'}

    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <EditContact />

    );
}

export async function getServerSideProps(context: any) {
    return loggedInOrRedirectToLogin(await getSession(context));
}

export default ContactDetails