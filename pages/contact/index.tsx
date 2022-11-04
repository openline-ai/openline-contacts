import type {NextPage} from 'next'
import {useRouter} from "next/router";
import Layout from "../../layout/layout";
import GridComponent from "../../components/GridComponent";
import {gql} from "graphql-request";

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
                               onEdit={(id: any) => router.push(`/contact/${id}`)}
                />
            </Layout>
        </>
    );
}

export default ContactList
