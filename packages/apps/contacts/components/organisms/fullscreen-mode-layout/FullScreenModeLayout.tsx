import React from 'react';
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import styles from "./fullscreen-mode.module.scss";
import {Button} from "../../atoms";

interface Props {
    fullScreenMode: boolean
    children: React.ReactNode
    classNames?: string;
}

export const FullScreenModeLayout: React.FC<Props> = ({fullScreenMode, children, classNames}) => {
    const router = useRouter();


    return (
        <div className={fullScreenMode ? `flex ${classNames} ${styles.fullScreenModeContainer}` : classNames}>
            {
                fullScreenMode && (
                    <div className={'flex flex-column pt-3 pl-3'}>
                        <Button className={'mr-3'} icon={faChevronLeft} onClick={() => router.push('/')}>
                            Back
                        </Button>
                    </div>
                )}
            <div className={'flex flex-column w-full'}>
            {children}
            </div>
        </div>
    );
};

