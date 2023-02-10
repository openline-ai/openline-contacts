import type {NextPage} from 'next'
import {DashboardList} from "../../components/contact";
import React from "react";


const Dashboard: NextPage = () => {
    return (
        <div className="m-auto mt-5" style={{minWidth: '1200px', maxWidth: '1200px'}}>
            <DashboardList fullScreenMode={false}/>
        </div>
    )
}

export default Dashboard
