import React  from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import styles from "./fullscreen-mode.module.scss";

interface Props {
   fullScreenMode: boolean
   children: React.ReactNode
}

export const FullScreenModeLayout: React.FC<Props> = ({fullScreenMode, children}) => {
    const router = useRouter();


    return (
        <div className={fullScreenMode ? styles.fullScreenModeContainer : ''}>
            {fullScreenMode && (
                <button onClick={() => router.push('/')} className={styles.backButton}>
                    <FontAwesomeIcon icon={faChevronLeft} color='#6366F1' height='40px' width='40px' fontWeight={800}/>
                </button>
            )}
            {children}
       </div>
    );
};

