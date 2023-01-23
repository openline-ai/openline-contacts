import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import styles from './login-panel.module.scss'


interface Props {
}

export const LoginPanel: React.FC<Props> = () => {
    const success = () => toast.success("Wow such login!");
    const forgot = () => toast.error("Much forgetful...");

    const [loginForm, setLoginForm] = useState(true);
    const waitlist = () => {
        setLoginForm(false);
    }
    const login = () => {
        setLoginForm(true);
    }

    return (
        <div className="flex w-full">
            <div className={styles.loginPanel}>
                <div className="surface-card pt-6 px-6 pb-5 shadow-2 border-round w-full sm:w-25rem">
                    {
                        loginForm &&
                        <>
                            <div className="text-center mb-5">
                                <img src="./logos/openline.svg" alt="Openline" height={50} className="mb-3" />

                                <div>
                                    <span className="text-600 font-medium line-height-3 text-sm">Don&apos;t have an account?</span>
                                    <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer text-sm" onClick={() => waitlist()}>Join the waitlist!</a>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-600 font-medium mb-2 text-sm">Email</label>
                                <InputText id="email" type="text" className="w-full mb-3" />

                                <label htmlFor="password" className="block text-600 font-medium mb-2 text-sm">Password</label>
                                <InputText type="password" className="w-full mb-3" />

                                <div className="flex align-items-center justify-content-between mb-6">
                                    <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer" onClick={forgot}>Forgot your password?</a>
                                </div>

                                <Button label="Sign In" className="w-full p-button-secondary" onClick={success} />
                                <div className="pt-5 text-center">
                                    <span className="font-medium line-height-3 text-sm" style={{ color: '#9E9E9E' }}>Protected by </span>
                                    <img src="./logos/ory-small.svg" alt="Ory" height={14} style={{ verticalAlign: 'middle' }} />
                                </div>
                            </div>
                        </>
                    }

                    {
                        loginForm ||
                        <>
                            <div className="text-center mb-5">
                                <img src="./logos/openline.svg" alt="Openline" height={50} className="mb-3" />

                                <div>
                                    <span className="text-600 font-medium line-height-3 text-sm">Already have an account?</span>
                                    <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer text-sm" onClick={() => login()}>Login now!</a>
                                </div>
                            </div>

                            <div>

                                <label htmlFor="firstName" className="block text-600 font-medium mb-2 text-sm">First Name</label>
                                <InputText type="firstName" className="w-full mb-3" />

                                <label htmlFor="lastName" className="block text-600 font-medium mb-2 text-sm">Last Name</label>
                                <InputText type="lastName" className="w-full mb-3" />

                                <label htmlFor="email" className="block text-600 font-medium mb-2 text-sm">Email</label>
                                <InputText id="email" type="text" className="w-full mb-6" />

                                <Button label="Join the Waitlist" className="w-full p-button-secondary" onClick={success} />
                            </div>
                        </>
                    }

                </div>
            </div>
        </div>
    );
};

