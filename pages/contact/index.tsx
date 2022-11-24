import type {NextPage} from 'next'
import {useRouter} from "next/router";
import Layout from "../../layout/layout";
import GridComponent from "../../components/generic/GridComponent";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {getEnumLabel} from "../../model/enums";
import {ContactTitleEnum} from "../../model/enum-contactTitle";

const ContactList: NextPage = () => {
    const router = useRouter();

    let onEdit = (id: any) => router.push(`/contact/${id}`);
    return (
        <>
            <Layout>
                <GridComponent gridTitle="Contacts"
                               hqlQuery="contacts"
                               columns={
                                   [
                                       {
                                           field: 'title',
                                           label: 'Title',
                                           hidden: true,
                                           sortFieldName: "TITLE"
                                       },
                                       {
                                           field: 'firstName',
                                           label: 'First name',
                                           hidden: true,
                                           sortFieldName: "FIRST_NAME"
                                       },
                                       {
                                           field: 'lastName',
                                           label: 'Last name',
                                           hidden: true,
                                           sortFieldName: "LAST_NAME"
                                       },
                                       {
                                           field: 'label',
                                           label: 'Label',
                                           hidden: true,
                                           sortFieldName: "LABEL"
                                       },
                                       {
                                           editLink: true,
                                           className: 'w50',
                                           label: 'Contact',
                                           template: (c: any) => {
                                               return <div className="cta" onClick={() => onEdit(c.id)}>
                                                   {getEnumLabel(ContactTitleEnum, c.title)}&nbsp;{c.firstName}&nbsp;{c.lastName}
                                               </div>
                                           }
                                       },
                                       {
                                           field: 'contactType{name}',
                                           label: 'Type',
                                           template: (c: any) => {
                                               return <div>{c.contactType ? c.contactType.name : ''}</div>
                                           }
                                       },
                                   ]
                               }
                               filters={[
                                   {
                                       fieldName: "TITLE",
                                       label: "Title",
                                       type: "DROPDOWN",
                                       options: ContactTitleEnum
                                   },
                                   {
                                       fieldName: "FIRST_NAME",
                                       label: "First name"
                                   },
                                   {
                                       fieldName: "LAST_NAME",
                                       label: "Last name"
                                   }
                               ]}
                               gridActions={
                                   <div className="flex align-items-center">
                                       <Button onClick={(e: any) => router.push(`/contact/new`)} className='p-button-text'>
                                           <FontAwesomeIcon icon={faCirclePlus} className="mr-2"/>Add a new contact
                                       </Button>
                                   </div>
                               }
                               onEdit={onEdit}
                />
            </Layout>
        </>
    );
}

export default ContactList
