import React, { FC } from 'react';
import { Avatar } from '../avatar';
import {StaticImageData} from "next/image";
import styles from "./avatar-button.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

interface Props extends Partial<HTMLButtonElement> {
    image?: StaticImageData;
    onClick?: () => void;
    ariaLabel: string;
}

export const AvatarButton: FC<Props> = ({ image, onClick, ariaLabel }) => {
    return (
        <div onClick={onClick} aria-label={ariaLabel} role="button" tabIndex={0} className={styles.button}>
            {image ? (
                <Avatar username={ariaLabel} image={image} />
            ) : <FontAwesomeIcon icon={faUser} />
            }
        </div>
    );
};