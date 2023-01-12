import React from 'react';
import styles from "./back-button.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";

export const BackButton: React.FC = () => {
    const router = useRouter();

    return (
        <button onClick={() => router.push('/')} className={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
    )
};

