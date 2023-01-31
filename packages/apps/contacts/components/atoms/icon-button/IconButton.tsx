import React, {EventHandler, FC} from 'react';
import styles from "./icon-button.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

interface Props {
    icon?: IconProp;
    onClick: EventHandler<any>;
    ariaLabel?: string;
    children?: HTMLCollection | undefined;
    mode?: 'default' | 'primary' | 'secondary';
    disabled?: boolean;
    className?: string;
    style?: any;
    type?: string
}

export const IconButton: FC<Props> = ({ icon, onClick, children, mode="default", ...rest}) => {
    return (
        <div
            {...rest}
            onClick={onClick}
            role="button" 
            tabIndex={0}
            style={rest?.style}
            className={`${styles.button} ${styles[mode]} ${rest.className}`}>
            <>
                {icon && (
                    <FontAwesomeIcon icon={icon} />
                ) }
                {children }
            </>
        </div>
    );
};