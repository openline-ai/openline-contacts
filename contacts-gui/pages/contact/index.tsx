import type {NextPage} from 'next'
import {useRouter} from "next/router";
import Layout from "../../layout/layout";
import GridComponent from "../../components/GridComponent";
import {gql} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";

const ContactList: NextPage = () => {
    const router = useRouter();

    return (
        <>
            <Layout>
                <GridComponent resourceLabel={'contact'}
                               hqlQuery="contacts"
                               columns={
                                   [
                                       {
                                           field: 'title',
                                           hidden: true
                                       },
                                       {
                                           field: 'firstName',
                                           header: 'First name',
                                           className: 'w50',
                                           editLink: true
                                       },
                                       {
                                           field: 'lastName',
                                           header: 'Last name',
                                           className: 'w50',
                                           editLink: false
                                       }
                                   ]
                               }
                               gridTitle="Contacts"
                               gridActions={
                                   <div className="flex align-items-center">
                                       <Button onClick={(e: any) => router.push(`/contact/new`)} className='p-button-text'>
                                           <FontAwesomeIcon icon={faCirclePlus} className="mr-2"/>Add a new contact
                                       </Button>
                                   </div>
                               }
                               onEdit={(id: any) => router.push(`/contact/${id}`)}
                />
            </Layout>
        </>
    );
}

export default ContactList
