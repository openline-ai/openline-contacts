import type {NextPage} from 'next'
import {useRouter} from "next/router";
import GridComponent from "../generic/GridComponent";
import {Button} from "../atoms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {PaginatedRequest} from "../../utils/pagination";
import {FullScreenModeLayout} from "../organisms/fullscreen-mode-layout";
import {useGraphQLClient} from "../../utils/graphQLClient";
import {GetDashboardData} from "../../services/sharedService";
import {DashboardTableHeaderLabel} from "./dashboard-table-header-label/DashboardTableHeaderLabel";
import {DashboardTableAddressCell, DashboardTableCell} from "./dashboard-table-header-label/DashboardTableCell";
import {Location} from "../../models/location";

export const DashboardList: NextPage<{ fullScreenMode: boolean }> = ({fullScreenMode}) => {
    const client = useGraphQLClient();
    const router = useRouter();

    const loadData = (params: PaginatedRequest) => {
        return GetDashboardData(client, params)
    }

    return (
        <FullScreenModeLayout fullScreenMode={fullScreenMode}>
            <div className="mt-5">
                <GridComponent gridTitle=""
                               queryData={(params: any) => loadData(params)}
                               globalFilterFields="searchTerm"
                               columns={[
                                   {
                                       editLink: true,
                                       className: 'w50',
                                       field: 'organization',
                                       label: () => (
                                           <DashboardTableHeaderLabel
                                               label="Organization"
                                               subLabel="Industry"
                                           />),
                                       template: (c: any) => {
                                           if (c.organization) {
                                               return (
                                                   <DashboardTableCell
                                                       label={c.organization.name}
                                                       subLabel={c.organization?.industry}
                                                       url={`/organization/${c.organization.id}`}/>

                                               )
                                           }
                                           if (!c.organization) {
                                               return <span>-</span>
                                           }
                                       }
                                   },
                                   {

                                       className: 'w10 capitalise',
                                       field: 'contact',
                                       label: () => (
                                           <DashboardTableHeaderLabel
                                               label="Name"
                                               subLabel="Role"
                                           />),
                                       template: (c: any) => {
                                           if (!c.contact) {
                                               return <span>-</span>
                                           }
                                           return (
                                               <DashboardTableCell
                                                   label={`${c.contact?.firstName} ${c.contact?.lastName}`}
                                                   subLabel={c.contact.job}
                                                   url={`/contact/${c.contact.id}`}/>

                                           )
                                       }
                                   },
                                   {

                                       className: 'w10 capitalise',
                                       field: 'contact',
                                       label: 'Email',
                                       template: (c: any) => {
                                           if (!c.contact?.emails) {
                                               return <span>-</span>
                                           }
                                           return (c.contact?.emails).map((data: any, index: number) => (
                                               <div className='flex flex-wrap' key={data.id}>
                                                   <DashboardTableCell
                                                       className='lowercase'
                                                       label={data.email}
                                                   />
                                                   {c.contact?.emails.length - 1 !== index && ', '}
                                               </div>
                                           ))
                                       }
                                   },
                                   {

                                       className: 'w10 capitalise',
                                       field: 'contact',
                                       label: () => (
                                           <DashboardTableHeaderLabel
                                               label="Location"
                                               subLabel="City, State, Country"
                                           />),

                                       template: (c: any) => {
                                           if (!c.contact?.locations?.length) {
                                               return <span>-</span>
                                           }

                                           return c.contact?.locations.map((data: Location) => (
                                               <DashboardTableAddressCell
                                                   key={data.id}
                                                   city={data?.place?.city}
                                                   state={data?.place?.state}
                                                   country={data?.place?.country}
                                               />
                                           ))
                                       }

                                   },
                               ]}
                               gridActions={
                                   <div className="flex align-items-center">
                                       <Button onClick={() => router.push(`/contact/new`)} className='p-button-text'>
                                           <FontAwesomeIcon icon={faPlus} className="mr-2"/>Add a new contact
                                       </Button>
                                   </div>
                               }
                               defaultLimit={fullScreenMode ? 10 : 5}

                />
            </div>

        </FullScreenModeLayout>


    );
}
