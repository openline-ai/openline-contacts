import type {NextPage} from 'next'
import {OrganizationList as OrganizationListComponent} from '../../components/organization/OrganizationList'
const OrganizationList: NextPage = () => {
    return (
        <OrganizationListComponent fullScreenMode />
    );
}

export default OrganizationList
