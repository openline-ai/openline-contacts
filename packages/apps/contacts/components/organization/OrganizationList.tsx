import type {NextPage} from 'next'
import {useRouter} from "next/router";
import GridComponent from "../../components/generic/GridComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faWindowRestore} from "@fortawesome/free-solid-svg-icons";
import {PaginatedRequest, PaginatedResponse} from "../../utils/pagination";
import {toast} from "react-toastify";
import {GetOrganizations} from "../../services/organizationService";
import {Organization} from "../../models/organization";
import {Address as AddressInterface} from "../../models/Address";

import {FullScreenModeLayout} from "../organisms/fullscreen-mode-layout";
import {Address, Button} from "../atoms";
import {useGraphQLClient} from "../../utils/graphQLClient";

export const OrganizationList: NextPage<{fullScreenMode: boolean}> = ({fullScreenMode}) => {
    const client =  useGraphQLClient()
    const router = useRouter();

    let onEdit = (id: any) => router.push(`/organization/${id}`);

    const loadData = function (params: PaginatedRequest) {
        return new Promise((resolve, reject) => {
            GetOrganizations(client, params).then((response: PaginatedResponse<Organization>) => {
                resolve({
                    content: response.content,
                    totalElements: response.totalElements
                });
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
                reject(reason);
            });
        });
    }

    return (
        <FullScreenModeLayout fullScreenMode={fullScreenMode}>
            <GridComponent gridTitle="Organizations"
                           globalFilterFields={["NAME", "SOURCE"]}
                           queryData={(params: any) => loadData(params)}
                           columns={[
                               {
                                   editLink: true,
                                   className: 'w10',
                                   field: 'name',
                                   label: 'Name'
                               },
                               {
                                   className: 'w10',
                                   field: 'industry',
                                   label: 'Industry'
                               },
                               {
                                   className: 'w10',
                                   field: 'website',
                                   label: 'Website'
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
                                   field: 'addresses',
                                   label: 'Addresses',
                                   template: (c: any) => {
                                       return <div key={c.id}
                                                   className='capitalise'>
                                           {!!c.addresses.length ? c.addresses.map((a:AddressInterface) => (
                                               <Address
                                                        key={a.id}
                                                        createdAt={a.createdAt}
                                                        address={a.address}
                                                        address2={a.address2}
                                                        city={a.city}
                                                        country={a.country}
                                                        zip={a.zip}
                                                        mode="light"
                                                       />
                                           )) : '-'}
                                       </div>
                                   }
                               }
                           ]}
                           sorting={[
                               {
                                   field: "NAME",
                                   label: "Name",
                               },
                               {
                                   field: "SOURCE",
                                   label: "Source"
                               },
                           ]}
                           filters={[
                               {
                                   field: "NAME",
                                   label: "Name",
                               },
                           ]}
                           gridActions={
                               <div className="flex align-items-center">
                                   {!fullScreenMode && (
                                       <Button onClick={() => router.push(`/organization`)}>
                                           <FontAwesomeIcon icon={faWindowRestore} className="mr-2"/>Full screen
                                       </Button>
                                   )}
                                   <Button onClick={() => router.push(`/organization/new`)}>
                                       <FontAwesomeIcon icon={faPlus} className="mr-2"/> Add an organization
                                   </Button>
                               </div>
                           }
                           onEdit={onEdit}
                           defaultLimit={fullScreenMode ? 10 : 5}
            />
        </FullScreenModeLayout>
    );
}