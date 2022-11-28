import type {NextPage} from 'next'
import {useRouter} from "next/router";
import GridComponent from "../../components/generic/GridComponent";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";

const ContactGroupList: NextPage = () => {
    const router = useRouter();

    return (
        <GridComponent hqlQuery="contactGroups"
                       columns={
                           [
                               {
                                   field: 'name',
                                   label: 'Name',
                                   className: 'w100',
                                   editLink: true,
                                   sortFieldName: "NAME"
                               }
                           ]
                       }
                       filters={[
                           {
                               fieldName: "NAME",
                               label: "Name"
                           }
                       ]}
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
    );
}

export default ContactGroupList
