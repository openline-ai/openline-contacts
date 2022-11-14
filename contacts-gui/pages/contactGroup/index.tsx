import type {NextPage} from 'next'
import {useRouter} from "next/router";
import Layout from "../../layout/layout";
import GridComponent from "../../components/GridComponent";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";

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
                               gridTitle="Contact groups"
                               gridActions={
                                   <div className="flex align-items-center">
                                       <Button onClick={(e: any) => router.push(`/contactGroup/new`)} className='p-button-text'>
                                           <FontAwesomeIcon icon={faCirclePlus} className="mr-2"/>Add new contact group
                                       </Button>
                                   </div>
                               }
                               onEdit={(id: any) => router.push(`/contactGroup/${id}`)}
                />
            </Layout>
        </>
    );
}

export default ContactGroupList