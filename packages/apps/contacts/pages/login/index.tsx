import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import { LoginPanel } from '../../components/organisms/login-panel';


const Login: NextPage = () => {

    const [backgroundImageUrl, setBackgroundImageUrl] = useState('')

    useEffect(() => {
        function getRandom(min: number, max: number) {
            return min + Math.floor(Math.random() * (max - min + 1));
        }
        let backgroundImageUrlNumber = String(getRandom(1, 5)).padStart(2, '0')
        let backgroundImageUrl = `/backgrounds/blueprint-000${backgroundImageUrlNumber}.png`;
        setBackgroundImageUrl(backgroundImageUrl);
    });

    return (
        <>
            <div className="flex flex-row h-full">
                <Image
                    alt="Mountains"
                    src={backgroundImageUrl}
                    quality={100}
                    fill
                    priority
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
