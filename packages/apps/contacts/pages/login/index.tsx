import React from 'react';
import Image from 'next/image';
import {LoginPanel} from "../../components/organisms/login-panel";

export async function getServerSideProps() {
    const backgroundImageUrlNumber = `${
        Math.floor(Math.random() * 75) + 1
    }`.padStart(2, '0');

    return {
        props: {
            image: `/backgrounds/blueprint/background-000${backgroundImageUrlNumber}.jpg`,
        },
    };
}
const Login = ({ image }: { image: string }) => {
    return (
        <>
            <Image
                alt=''
                src={image}
                fill
                priority={true}
                sizes="100vw"
                unoptimized={true}
                style={{
                    objectFit: 'cover',
                }}
            />
            <div className="flex flex-row h-full" style={{background: 'rgb(0,0,50)'}}>
                <div className="login-panel flex-grow-1">
                    <LoginPanel/>
                </div>
            </div>
        </>
    );
};

export default Login;
