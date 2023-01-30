import React, {ButtonHTMLAttributes, EventHandler, FC} from 'react';
import styles from "./button.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: IconProp;
    onClick: EventHandler<any>;
    ariaLabel?: string;
    children?: React.ReactNode;
    style?: any;
    mode?: 'default' | 'primary' | 'secondary' | 'danger' | 'link' | 'dangerLink';
}

export const Button: FC<Props> = ({ icon, onClick, children, mode="default", ...rest}) => {
    return (
        <button {...rest} onClick={onClick} className={`${styles.button} ${styles[mode]}`}>
            <>
                {icon && (
                    <FontAwesomeIcon icon={icon} />
                ) }
                {children}
            </>
        </button>
    );
};