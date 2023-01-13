import type {NextPage} from 'next'
import {useRouter} from "next/router";
import GridComponent from "../../components/generic/GridComponent";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faWindowRestore} from "@fortawesome/free-solid-svg-icons";
import {GraphQLClient} from "graphql-request";
import {PaginatedRequest, PaginatedResponse} from "../../utils/pagination";
import {getSession} from "next-auth/react";
import {loggedInOrRedirectToLogin} from "../../utils/logged-in";
import {toast} from "react-toastify";
import {GetOrganizations} from "../../services/organizationService";
import {Organization} from "../../models/organization";
import {FullScreenModeLayout} from "../organisms/fullscreen-mode-layout";

export const OrganizationList: NextPage<{fullScreenMode: boolean}> = ({fullScreenMode}) => {
    const client = new GraphQLClient(`/customer-os-api/query`);
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
                                   label: 'industry'
                               },
                               {
                                   className: 'w10',
                                   field: 'website',
                                   label: 'Website'
                               }
                           ]}
                           gridActions={
                               <div className="flex align-items-center">
                                   <Button onClick={(e: any) => router.push(`/organization`)} className='p-button-text'>
                                       <FontAwesomeIcon icon={faWindowRestore} className="mr-2"/>Full screen
                                   </Button>
                                   <Button onClick={(e: any) => router.push(`/organization/new`)} className='p-button-text'>
                                       <FontAwesomeIcon icon={faCirclePlus} className="mr-2"/>Add an organization
                                   </Button>
                               </div>
                           }
                           onEdit={onEdit}
            />
        </FullScreenModeLayout>
    );
}

export async function getServerSideProps(context: any) {
    return loggedInOrRedirectToLogin(await getSession(context));
}

