import React  from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import styles from "./fullscreen-mode.module.scss";
import {IconButton} from "../../atoms/icon-button";
import {Button} from "../../atoms";

interface Props {
   fullScreenMode: boolean
   children: React.ReactNode
   classNames?: string;
}

export const FullScreenModeLayout: React.FC<Props> = ({fullScreenMode, children, classNames}) => {
    const router = useRouter();


    return (
        <div className={fullScreenMode ? `${classNames} ${styles.fullScreenModeContainer}` : classNames}>
            {fullScreenMode && (
                <div style={{width: '40px'}}>
                    <Button icon={faChevronLeft} onClick={() => router.push('/')}>
                      Back
                    </Button>
                </div>
            )}
            {children}
       </div>
    );
};

