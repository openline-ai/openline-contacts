import type {NextPage} from 'next'
import {DashboardList} from "../../components/contact";
import React from "react";


const Dashboard: NextPage = () => {
    return (
        <div className="mt-5 mr-6 ml-5 ">
             <div className="mt-7">
                 <DashboardList fullScreenMode={false} />
             </div>
        </div>
    )
}

export default Dashboard
