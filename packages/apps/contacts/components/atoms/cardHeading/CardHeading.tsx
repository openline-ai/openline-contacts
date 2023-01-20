import React, {ReactNode} from 'react';
import styles from './card-heading.module.scss'
interface Props  {
    children: ReactNode;
}

export const CardHeading: React.FC<Props> = ({ children}) => {
    return <h1 className={styles.heading}>
        {children}
    </h1>
};

