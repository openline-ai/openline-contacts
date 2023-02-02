import React, {Dispatch, SetStateAction} from 'react';
import {toast} from 'react-toastify';
import {Button} from 'primereact/button';
import styles from './login-panel.module.scss'
import {NextRouter} from "next/router";
import {Configuration, FrontendApi} from "@ory/client";
import {edgeConfig} from "@ory/integrations/next";
import {AxiosError} from "axios/index";

// A small function to help us deal with errors coming from fetching a flow.
export function handleFlowError<S>(
    router: NextRouter,
    flowType: "login" | "registration" | "settings" | "recovery" | "verification",
    resetFlow: Dispatch<SetStateAction<S | undefined>>,
) {
    return async (err: AxiosError) => {
        //@ts-ignore
        switch (err.response?.data.error?.id) {
            case "session_aal2_required":
                // 2FA is enabled and enforced, but user did not perform 2fa yet!
                //@ts-ignore
                window.location.href = err.response?.data.redirect_browser_to
                return
            case "session_already_available":
                // User is already signed in, let's redirect them home!
                await router.push("/")
                return
            case "session_refresh_required":
                // We need to re-authenticate to perform this action
                //@ts-ignore
                window.location.href = err.response?.data.redirect_browser_to
                return
            case "self_service_flow_return_to_forbidden":
                // The flow expired, let's request a new one.
                toast.error("The return_to address is not allowed.")
                resetFlow(undefined)
                await router.push("/" + flowType)
                return
            case "self_service_flow_expired":
                // The flow expired, let's request a new one.
                toast.error("Your interaction expired, please fill out the form again.")
                resetFlow(undefined)
                await router.push("/" + flowType)
                return
            case "security_csrf_violation":
                // A CSRF violation occurred. Best to just refresh the flow!
                toast.error(
                    "A security violation was detected, please fill out the form again.",
                )
                resetFlow(undefined)
                await router.push("/" + flowType)
                return
            case "security_identity_mismatch":
                // The requested item was intended for someone else. Let's request a new flow...
                resetFlow(undefined)
                await router.push("/" + flowType)
                return
            case "browser_location_change_required":
                // Ory Kratos asked us to point the user to this URL.
                //@ts-ignore
                window.location.href = err.response.data.redirect_browser_to
                return
        }

        switch (err.response?.status) {
            case 410:
                // The flow expired, let's request a new one.
                resetFlow(undefined)
                await router.push("/" + flowType)
                return
        }

        // We are not able to handle the error? Return it.
        return Promise.reject(err)
    }
}

const ory = new FrontendApi(new Configuration(edgeConfig))

export const RestorePanel: React.FC = () => {

    return (
        <div className="flex w-full">
            <div className={styles.loginPanel}>
                <div className="surface-card pt-6 px-6 pb-5 shadow-6 border-round w-full sm:w-25rem">
                    <div className="text-center mb-5">
                        <img src="./logos/openline.svg" alt="Openline" height={50} className="mb-3"/>

                        <div>
                            <span className="text-600 font-medium line-height-3 text-sm">Don&apos;t have an account?</span>
                            {/*<a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer text-sm" onClick={() => waitlist()}>Join the waitlist!</a>*/}
                        </div>
                    </div>

                    <form>
                        <label htmlFor="email" className="block text-600 font-medium mb-3 text-sm">Enter your email here for a password reset</label>
                        {/*<InputText id="email" type="text" autoComplete="username" className="w-full mb-5" onChange={(e) => setForgottenPasswordEmail(e.target.value)} />*/}

                        <Button label="Reset Password" className="w-full p-button-secondary" type='submit'/>
                    </form>
                </div>
            </div>
        </div>
    );
};