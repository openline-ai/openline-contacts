import type {NextPage} from 'next'
import {useRouter} from "next/router";
import Layout from "../../layout/layout";
import GridComponent from "../../components/GridComponent";

const ContactGroupList: NextPage = () => {
    const router = useRouter();

    return (
        <>
            <Layout>
                <GridComponent resourceLabel={'contact group'}
                               hqlQuery="contactGroups"
                               columns={
                                   [
                                       {
                                           field: 'name',
                                           header: 'Name',
                                           className: 'w100',
                                           editLink: true
                                       }
                                   ]
                               }
                               onEdit={(id: any) => router.push(`/contactGroup/${id}`)}
                />
            </Layout>
        </>
    );
}

export default ContactGroupList
