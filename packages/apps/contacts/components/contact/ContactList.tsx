import type {NextPage} from 'next'
import {useRouter} from "next/router";
import GridComponent from "../../components/generic/GridComponent";
import {Button} from "../atoms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faWindowRestore} from "@fortawesome/free-solid-svg-icons";
import {getEnumLabel} from "../../model/enums";
import {ContactTitleEnum} from "../../model/enum-contactTitle";
import {gql, GraphQLClient} from "graphql-request";
import {MapGridFilters} from "../../utils/converters";
import {PaginatedRequest} from "../../utils/pagination";
import {FullScreenModeLayout} from "../organisms/fullscreen-mode-layout";
import {useGraphQLClient} from "../../utils/graphQLClient";

export const ContactList: NextPage< {fullScreenMode: boolean}> = ({fullScreenMode}) => {
    const client =  useGraphQLClient();
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
                        emails {
                            email
                        }
                        phoneNumbers {
                            e164
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
        <FullScreenModeLayout fullScreenMode={fullScreenMode} >


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
                                           {
                                               c.firstName &&
                                               <span className="mr-1">{c.firstName} {c.lastName}</span>
                                           }
                                           {
                                               !c.firstName && c.emails && c.emails[0] &&
                                               <span>{c.emails[0].email}</span>
                                           }
                                           {
                                               (!c.firstName && (!c.emails  || !c.emails[0])) && c.phoneNumbers && c.phoneNumbers[0] &&
                                               <span>{c.phoneNumbers[0].e164}</span>
                                           }
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
                                   {!fullScreenMode && (
                                       <Button onClick={() => router.push(`/contact`)} className='p-button-text'>
                                           <FontAwesomeIcon icon={faWindowRestore} className="mr-2"/>Full screen
                                       </Button>
                                   )}

                                   <Button onClick={() => router.push(`/contact/new`)} className='p-button-text'>
                                       <FontAwesomeIcon icon={faPlus} className="mr-2"/>Add a new contact
                                   </Button>
                               </div>
                           }
                           onEdit={onEdit}
                           defaultLimit={fullScreenMode ? 10 : 5}

            />
        </FullScreenModeLayout>


    );
}
