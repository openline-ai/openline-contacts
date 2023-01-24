import type { NextPage } from 'next'
import React, { useEffect } from 'react';
import Image from 'next/image'
import { LoginPanel } from '../../components/organisms/login-panel';


const Login: NextPage = () => {

    function getRandom(min: number, max: number) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    const backgroundImageUrlNumber = String(getRandom(1, 5)).padStart(2, '0');
    const backgroundImageUrl = `/backgrounds/blueprint-000${backgroundImageUrlNumber}.png`;

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
