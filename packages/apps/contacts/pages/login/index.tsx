import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import { LoginPanel } from '../../components/organisms/login-panel';


const Login: NextPage = () => {

    const [backgroundImageUrl, setBackgroundImageUrl] = useState('')

    function getRandom(min: number, max: number) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    useEffect(() => {
        const backgroundImageUrlNumber = String(getRandom(1, 75)).padStart(2, '0')
        const backgroundImageUrl = `/backgrounds/blueprint/background-000${backgroundImageUrlNumber}.jpg`;
        setBackgroundImageUrl(backgroundImageUrl);
    }, []);

    return (
        <>
            <div className="flex flex-row h-full" style={{background: 'rgb(0,0,50)'}}>
                <Image
                    alt=""
                    src={backgroundImageUrl}
                    fill
                    priority={true}
                    sizes="100vw"
                    style={{
                        objectFit: 'cover',
                    }}
                />
                <div className="login-panel flex-grow-1">
                    <LoginPanel />
                </div>
            </div>
        </>
    )
}

export default Login
