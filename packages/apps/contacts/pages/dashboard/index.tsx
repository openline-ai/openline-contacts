import type {NextPage} from 'next'
import {DashboardList} from "../../components/contact";
import React from "react";


const Dashboard: NextPage = () => {
    return (
        <div className="mt-3 ml-5" style={{maxWidth: '1200px'}}>
            <DashboardList fullScreenMode={false}/>
        </div>
    )
}

export default Dashboard
