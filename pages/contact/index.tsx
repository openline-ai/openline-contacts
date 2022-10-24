import type {NextPage} from 'next'
import {useRouter} from "next/router";
import Layout from "../../layout/layout";
import GridComponent from "../../components/GridComponent";

const ContactList: NextPage = () => {
    const router = useRouter();

    return (
        <>
            <Layout>
                <GridComponent resourceLabel={'contact'}
                               resourceLoadBaseUrl={'contacts'}
                               columns={
                                   [
                                       {
                                           field: 'first_name',
                                           header: 'First name',
                                           className: 'w100',
                                           editLink: true
                                       },
                                       {
                                           field: 'last_name',
                                           header: 'Last name',
                                           className: 'w100',
                                           editLink: true
                                       },
                                       {
                                           field: 'email',
                                           header: 'Last name',
                                           className: 'w100',
                                           editLink: true
                                       }
                                   ]
                               }
                               filters={
                                   {
                                       'name': {value: '', matchMode: 'contains'},
                                   }
                               }
                               prepareDataForGrid={(response: any) => {return response.contacts}}
                               onEdit={(id: any) => router.push(`/contact/${id}`)}
                />
            </Layout>
        </>
    );
}

export default ContactList
