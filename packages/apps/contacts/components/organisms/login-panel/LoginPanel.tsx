import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import styles from './login-panel.module.scss'


interface Props {
}

export const LoginPanel: React.FC<Props> = () => {

    const [loginForm, setLoginForm] = useState('login');

    const waitlist = () => setLoginForm('waitlist');
    const login = () => setLoginForm('login');
    const forgotPassword = () => setLoginForm('forgotPassword');

    var INIT = "INIT";
    var SUBMITTING = "SUBMITTING";
    var SUCCESS = "SUCCESS";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [forgottenPasswordEmail, setForgottenPasswordEmail] = useState("");
    const [formState, setFormState] = useState(INIT);
    const [errorMessage, setErrorMessage] = useState("");

    const SignUpFormError = (errorMessage?: string) => toast.error(errorMessage || "Oops! Something went wrong, please try again");

    const isValidEmail = (email: string) => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
        // return true;
    }

    /**
         * Rate limit the number of submissions allowed
         * @returns {boolean} true if the form has been successfully submitted in the past minute
         */
    const hasRecentSubmission = () => {
        const time = new Date();
        const timestamp = time.valueOf();
        const previousTimestamp = localStorage.getItem("loops-form-timestamp");

        // Indicate if the last sign up was less than a minute ago
        if (
            previousTimestamp &&
            Number(previousTimestamp) + 60 * 1000 > timestamp
        ) {
            setErrorMessage("Too many signups, please try again in a little while");
            SignUpFormError(errorMessage)
            return true;
        }

        localStorage.setItem("loops-form-timestamp", timestamp.toString());
        return false;
    };

    const resetForm = () => {
        setEmail("");
        setFormState(INIT);
        setErrorMessage("");
    };

    const handleSubmit = (event: any) => {
        // Prevent the default form submission
        event.preventDefault();

        // boundary conditions for submission
        if (formState !== INIT) return;
        if (!isValidEmail(email)) {
            setErrorMessage("Please enter a valid email");
            SignUpFormError(errorMessage)
            return;
        }
        if (hasRecentSubmission()) return;
        setFormState(SUBMITTING);

        // build body
        const formBody = `userGroup=${encodeURIComponent("Waitlist")}&email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`;

        // API request to add user to newsletter
        fetch(`https://app.loops.so/api/newsletter-form/cl7hzfqge458409jvsbqy93u9`, {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then((res: any) => {
                if (res) {
                    resetForm();
                    setFormState(SUCCESS);
                } else {
                    setErrorMessage(res.statusText);
                    localStorage.setItem("loops-form-timestamp", "");
                    SignUpFormError(errorMessage)
                }
            })
            .catch(error => {
                // check for cloudflare error
                if (error.message === "Failed to fetch") {
                    setErrorMessage("Too many signups, please try again in a little while");
                    SignUpFormError(errorMessage)
                } else if (error.message) {
                    setErrorMessage(error.message);
                    SignUpFormError(errorMessage)
                }
                localStorage.setItem("loops-form-timestamp", "");
            });
    };

    const handleLogin = (event: any) => {
        event.preventDefault();

        if (!isValidEmail(email)) {
            SignUpFormError("Please enter a valid email")
            return;
        }
        if (password === '' || null) {
            SignUpFormError("Please enter your password")
            return;
        }
        else {
            SignUpFormError("Incorrect login details, please try again")
        }
    };

    const handleForgotPassword = (event: any) => {
        event.preventDefault();
        
        if (forgottenPasswordEmail === '' || null) {
            SignUpFormError("Please enter your email")
            return;
        }
        if (!isValidEmail(forgottenPasswordEmail)) {
            SignUpFormError("Please enter a valid email")
            return;
        }
        else {
            toast.success("Please check your email for a password reset link!")
            return;
        }
    };

    return (
        <div className="flex w-full">
            <div className={styles.loginPanel}>
                <div className="surface-card pt-6 px-6 pb-5 shadow-6 border-round w-full sm:w-25rem">
                    {
                        loginForm === 'login' &&
                        <>
                            <div className="text-center mb-5">
                                <img src="./logos/openline.svg" alt="Openline" height={50} className="mb-3" />

                                <div>
                                    <span className="text-600 font-medium line-height-3 text-sm">Don&apos;t have an account?</span>
                                    <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer text-sm" onClick={() => waitlist()}>Join the waitlist!</a>
                                </div>
                            </div>

                            <div>
                                <form onSubmit={handleLogin}>
                                    <label htmlFor="email" className="block text-600 font-medium mb-2 text-sm">Email</label>
                                    <InputText id="email" type="text" autoComplete="username" className="w-full mb-3" onChange={(e) => setEmail(e.target.value)} />

                                    <label htmlFor="password" className="block text-600 font-medium mb-2 text-sm">Password</label>
                                    <InputText type="password" autoComplete='current-password' className="w-full mb-3" onChange={(e) => setPassword(e.target.value)} />

                                    <div className="flex align-items-center justify-content-between mb-6">
                                        <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer text-sm" onClick={forgotPassword}>Forgot your password?</a>
                                    </div>

                                    <Button label="Sign In" className="w-full p-button-secondary" type='submit' />
                                </form>
                                <div className="pt-5 text-center">
                                    <span className="font-medium line-height-3 text-sm" style={{ color: '#9E9E9E' }}>Protected by </span>
                                    <img src="./logos/ory-small.svg" alt="Ory" height={14} style={{ verticalAlign: 'middle' }} />
                                </div>
                            </div>
                        </>
                    }

                    {
                        loginForm === 'waitlist' &&
                        <>
                            <div className="text-center mb-5">
                                <img src="./logos/openline.svg" alt="Openline" height={50} className="mb-3" />

                                <div>
                                    <span className="text-600 font-medium line-height-3 text-sm">Already have an account?</span>
                                    <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer text-sm" onClick={() => login()}>Login now!</a>
                                </div>
                            </div>

                            {formState === SUCCESS &&
                                <>
                                    <div className="text-800 font-medium line-height-3 text-center py-8">
                                        Thanks for joining the waitlist - you should have a welcome email in your inbox already!
                                    </div>
                                    <div className='pt-5 text-center'>
                                        <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer text-sm" href="https://www.openline.ai">Head back to the Openline website!</a>
                                    </div>
                                </>
                            }

                            {formState === INIT &&
                                <div>
                                    <form onSubmit={handleSubmit}>
                                        <label htmlFor="firstName" className="block text-600 font-medium mb-2 text-sm">First Name</label>
                                        <InputText type="firstName" className="w-full mb-3" onChange={(e) => setFirstName(e.target.value)} />

                                        <label htmlFor="lastName" className="block text-600 font-medium mb-2 text-sm">Last Name</label>
                                        <InputText type="lastName" className="w-full mb-3" onChange={(e) => setLastName(e.target.value)} />

                                        <label htmlFor="email" className="block text-600 font-medium mb-2 text-sm">Email</label>
                                        <InputText id="email" type="text" className="w-full mb-6" onChange={(e) => setEmail(e.target.value)} />

                                        <Button label={formState === SUBMITTING ? "Please wait..." : "Join the Waitlist"} className="w-full p-button-secondary" type="submit" />
                                    </form>
                                    <div className="pt-5 text-center">
                                        <a href='https://www.openline.ai' style={{ color: '#9E9E9E', textDecoration: 'none' }}>
                                            <span className="font-medium mr-1 cursor-pointer text-sm">Powered by</span>
                                            <img src="./logos/openline_gray.svg" alt="Ory" height={20} style={{ verticalAlign: 'middle' }} />
                                        </a>
                                    </div>
                                </div>
                            }

                        </>
                    }

                    {
                        loginForm === 'forgotPassword' &&
                        <>
                            <div className="text-center mb-5">
                                <img src="./logos/openline.svg" alt="Openline" height={50} className="mb-3" />

                                <div>
                                    <span className="text-600 font-medium line-height-3 text-sm">Remembered already?</span>
                                    <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer text-sm" onClick={() => login()}>Login now!</a>
                                </div>
                            </div>

                            <div>
                                <form onSubmit={handleForgotPassword}>
                                    <label htmlFor="email" className="block text-600 font-medium mb-3 text-sm">Enter your email here for a password reset</label>
                                    <InputText id="email" type="text" autoComplete="username" className="w-full mb-5" onChange={(e) => setForgottenPasswordEmail(e.target.value)} />

                                    <Button label="Reset Password" className="w-full p-button-secondary" type='submit' />
                                </form>

                                <div className="pt-5 text-center">
                                    <span className="font-medium line-height-3 text-sm" style={{ color: '#9E9E9E' }}>Protected by </span>
                                    <img src="./logos/ory-small.svg" alt="Ory" height={14} style={{ verticalAlign: 'middle' }} />
                                </div>
                            </div>
                        </>
                    }

                </div>
            </div>
        </div>
    );
};

