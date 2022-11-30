import type {NextPage} from 'next'
import {useRouter} from "next/router";
import GridComponent from "../../components/generic/GridComponent";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {getEnumLabel} from "../../model/enums";
import {ContactTitleEnum} from "../../model/enum-contactTitle";
import {gql, GraphQLClient} from "graphql-request";
import {MapGridFilters} from "../../utils/converters";
import {PaginatedRequest} from "../../utils/pagination";

const ContactList: NextPage = () => {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);
    const router = useRouter();

    let onEdit = (id: any) => router.push(`/contact/${id}`);

    const loadData = function (params: PaginatedRequest) {
        return new Promise((resolve, reject) => {

            const query = gql`query GetContacts($pagination: Pagination, $where: Filter, $sort: [SortBy!]){
                contacts(pagination: $pagination, where: $where, sort: $sort){
                    content {
                        id
                        title
                        firstName
                        lastName
                        contactType{
                            name
                        }
                    }
                    totalElements
                }
            }`

            client.request(query, {
                pagination: params.pagination,
                where: MapGridFilters(params.where),
                sort: params.sort,
            }).then((response: any) => {
                if (response.contacts) {
                    resolve({
                        content: response.contacts.content,
                        totalElements: response.contacts.totalElements
                    });
                } else {
                    reject(response.errors);
                }
            });
        });
    }

    return (
        <>
            <GridComponent gridTitle="Contacts"
                           queryData={(params: any) => loadData(params)}
                           columns={[
                               {
                                   editLink: true,
                                   className: 'w50',
                                   field: 'contact',
                                   label: 'Contact',
                                   template: (c: any) => {
                                       return <div key={c.id} className="cta" onClick={() => onEdit(c.id)}>
                                           <span>{getEnumLabel(ContactTitleEnum, c.title)}</span>
                                           {
                                               c.title &&
                                               <span className="mr-1"></span>
                                           }
                                           <span>{c.firstName}<span className="mr-1"></span>{c.lastName}</span>
                                       </div>
                                   }
                               },
                               {
                                   field: 'contactType',
                                   label: 'Type',
                                   template: (c: any) => {
                                       return <div key={c.id}>{c.contactType ? c.contactType.name : ''}</div>
                                   }
                               },
                           ]}
                           filters={[
                               {
                                   field: "TITLE",
                                   label: "Title",
                                   type: "DROPDOWN",
                                   options: ContactTitleEnum
                               },
                               {
                                   field: "FIRST_NAME",
                                   label: "First name"
                               },
                               {
                                   field: "LAST_NAME",
                                   label: "Last name"
                               }
                           ]}
                           sorting={[
                               {
                                   field: "TITLE",
                                   label: "Title",
                               },
                               {
                                   field: "FIRST_NAME",
                                   label: "First name"
                               },
                               {
                                   field: "LAST_NAME",
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
        </>
    );
}

export default ContactList
