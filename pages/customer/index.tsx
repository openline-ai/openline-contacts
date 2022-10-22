import type {NextPage} from 'next'
import {useRouter} from "next/router";
import Layout from "../../layout/layout";
import GridComponent from "../../components/GridComponent";

const CustomerList: NextPage = () => {
    const router = useRouter();

    return (
        <>
            <Layout>
                <GridComponent resourceLabel={'customer'}
                               resourceLoadBaseUrl={'customers'}
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
                               filters={
                                   {
                                       'name': {value: '', matchMode: 'contains'},
                                   }
                               }
                               prepareDataForGrid={(response: any) => {return response.customers}}
                               onEdit={(id: any) => router.push(`/customer/${id}`)}/>
            </Layout>
        </>
    );
}

export default CustomerList
