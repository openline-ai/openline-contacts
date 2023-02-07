import type {NextPage} from 'next'
import {useRouter} from "next/router";
import GridComponent from "../../components/generic/GridComponent";
import {Button} from "../atoms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faWindowRestore} from "@fortawesome/free-solid-svg-icons";
import {ContactTitleEnum} from "../../model/enum-contactTitle";
import {gql} from "graphql-request";
import {MapGridFilters} from "../../utils/converters";
import {PaginatedRequest} from "../../utils/pagination";
import {FullScreenModeLayout} from "../organisms/fullscreen-mode-layout";
import {useGraphQLClient} from "../../utils/graphQLClient";
import {TagsList} from "../atoms/tag-input/TagInput";

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
                        source
                        title
                        firstName
                        lastName
                        label
                        source
#                        roles {
#                            id
#                            jobTitle
#                            organization {
#                                name
#                            }
#                            primary
#                        }
                        tags {
                            id
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
                           globalFilterFields={["FIRST_NAME", "TITLE", "LAST_NAME"]}
                           columns={[
                               {
                                   editLink: true,
                                   className: 'w50',
                                   field: 'contact',
                                   label: 'Contact',
                                   template: (c: any) => {
                                       return <div key={c.id} className="cta" onClick={() => onEdit(c.id)}>
                                           {
                                               (c.firstName || c.lastName) &&
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

                                           {
                                               !c.firstName && !c.lastName && (!c.emails  || !c.emails[0]) && !c.phoneNumbers.length && (
                                                   <span> Unknown user</span>
                                               )

                                           }
                                       </div>
                                   }
                               },
                               {
                                   field: 'tags',
                                   label: 'Tags',
                                   template: (c: any) => {
                                       return <TagsList tags={c.tags} readOnly/>
                                   }
                               },
                               {

                                   display: "HIDE",
                                   className: 'w10 capitalise',
                                   field: 'source',
                                   label: 'Source'
                               },
                               {

                                   display: "HIDE",
                                   className: 'w10 capitalise',
                                   field: 'label',
                                   label: 'Label'
                               },  
                               // {
                               //
                               //     display: "HIDE",
                               //     className: 'w10 capitalise',
                               //     field: 'roles',
                               //     label: 'Organizations',
                               //     template: ({roles}: any) => {
                               //         if(!roles.length) {
                               //             return "-"
                               //         }
                               //
                               //         return (
                               //             <div className="flex flex-column">
                               //                 {roles.map((role:any) => (
                               //                     <div className='capitalise' key={role.id}>
                               //                         {role?.organization?.name}
                               //                         {role.primary && (
                               //                             <span className="text-sm text-gray-600 ml-2">Primary</span>
                               //                         )}
                               //                         {role?.jobTitle && (
                               //                             <span className="text-sm text-gray-600 ml-2">({role?.jobTitle})</span>
                               //                         )}
                               //
                               //                     </div>
                               //                 ))}
                               //
                               //             </div>
                               //         )
                               //     }
                               // },
                               {

                                   display: "HIDE",
                                   className: 'w10 capitalise',
                                   field: 'label',
                                   label: 'Label'
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
                               },
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
