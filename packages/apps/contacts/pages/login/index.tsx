import type { NextPage } from 'next'
import React, { useEffect } from 'react';
import { appendErrors } from 'react-hook-form';
// import { getSession } from "next-auth/react";
// import { loggedInOrRedirectToLogin } from "../../utils/logged-in";
import { LoginPanel } from '../../components/organisms/login-panel';


const Login: NextPage = () => {
    function setBackgroundImage(newColor: any) {
        document.documentElement.style.setProperty('--login-background', newColor);
    }
    useEffect(() => {
        function getRandom(min: number, max: number) {
            return min + Math.floor(Math.random() * (max - min + 1));
        }
        const backgroundImageUrlNumber = String(getRandom(1,5)).padStart(2, '0');
        const backgroundImageUrl = `url(/backgrounds/blueprint-000${backgroundImageUrlNumber}.png)`;
        setBackgroundImage(backgroundImageUrl);
    }, [])
    return (
        <>
            <div className="flex flex-row h-full">
                <div className="login-panel flex-grow-1">
                    {/* <div className='light x1'></div>
                    <div className='light x2'></div>
                    <div className='light x3'></div>
                    <div className='light x4'></div>
                    <div className='light x5'></div>
                    <div className='light x6'></div>
                    <div className='light x7'></div>
                    <div className='light x8'></div>
                    <div className='light x9'></div> */}
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
