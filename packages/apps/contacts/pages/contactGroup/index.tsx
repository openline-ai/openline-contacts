import type {NextPage} from 'next'
import {useRouter} from "next/router";
import GridComponent from "../../components/generic/GridComponent";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {gql, GraphQLClient} from "graphql-request";
import {MapGridFilters} from "../../utils/converters";
import {PaginatedRequest} from "../../utils/pagination";

const ContactGroupList: NextPage = () => {
    const client = new GraphQLClient(`/customer-os-api/query`);
    const router = useRouter();

    const loadData = function (params: PaginatedRequest) {
        return new Promise((resolve, reject) => {

            const query = gql`query GetContacts($pagination: Pagination, $where: Filter, $sort: [SortBy!]){
                contactGroups(pagination: $pagination, where: $where, sort: $sort){
                    content {
                        id
                        name
                    }
                    totalElements
                }
            }`

            client.request(query, {
                pagination: params.pagination,
                where: MapGridFilters(params.where),
                sort: params.sort,
            }).then((response: any) => {
                if (response.contactGroups) {
                    resolve({
                        content: response.contactGroups.content,
                        totalElements: response.contactGroups.totalElements
                    });
                } else {
                    reject(response.errors);
                }
            });
        });
    }

    return (
        <GridComponent queryData={(params: any) => loadData(params)}
                       columns={[
                           {
                               field: 'name',
                               label: 'Name',
                               className: 'w100',
                               editLink: true
                           }
                       ]}
                       filters={[
                           {
                               field: "NAME",
                               label: "Name"
                           }
                       ]}
                       sorting={[
                           {
                               field: "NAME",
                               label: "Name",
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
