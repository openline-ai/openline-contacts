import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import styles from './login-panel.module.scss'


interface Props {
}

export const LoginPanel: React.FC<Props> = () => {
    const success = () => toast.success("Wow such login!");
    const forgot = () => toast.error("Much forgetful...");

    return (
        <div className={styles.loginPanel}>
            <div className={styles.loginPanel__content}>
                <div className="surface-card p-6 shadow-2 border-round w-full sm:w-25rem">
                    <div className="text-center mb-5">
                        <img src="./logos/openline.svg" alt="Openline" height={50} className="mb-3" />
                        <div>
                            <span className="text-600 font-medium line-height-3 text-sm">Don&apos;t have an account?</span>
                            <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer text-sm" href="/waitlist">Join the waitlist!</a>
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

                        <Button label="Sign In" className="w-full p-button-secondary" onClick={success}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

