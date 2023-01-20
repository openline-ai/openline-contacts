import type { NextPage } from 'next'
import React from 'react';
// import { getSession } from "next-auth/react";
// import { loggedInOrRedirectToLogin } from "../../utils/logged-in";
import { LoginPanel } from '../../components/organisms/login-panel';


const Login: NextPage = () => {

    return (
        <>
            <div className="flex flex-row h-full">
                <div className="login-panel flex-grow-1">
                    <div className='light x1'></div>
                    <div className='light x2'></div>
                    <div className='light x3'></div>
                    <div className='light x4'></div>
                    <div className='light x5'></div>
                    <div className='light x6'></div>
                    <div className='light x7'></div>
                    <div className='light x8'></div>
                    <div className='light x9'></div>
                    <LoginPanel />
                </div>
            </div>
        </>
    )
}

// export async function getServerSideProps(context: any) {
//     return loggedInOrRedirectToLogin(await getSession(context));
// }

export default Login
