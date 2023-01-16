import type {NextPage} from 'next'
import {getSession} from "next-auth/react";
import {loggedInOrRedirectToLogin} from "../../utils/logged-in";
import {ContactList} from "../../components/contact";
import {OrganizationList} from "../../components/organization/OrganizationList";

const Dashboard: NextPage = () => {
    return (
        <div className="mt-5 mr-6 ml-5 ">
            <div className="mt-7">
                <OrganizationList fullScreenMode={false}/>
            </div>
             <div className="mt-7">
                 <ContactList fullScreenMode={false} />
             </div>
        </div>
    )
}

export async function getServerSideProps(context: any) {
    return loggedInOrRedirectToLogin(await getSession(context));
}

export default Dashboard
