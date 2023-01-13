import React from 'react';
import styles from "./divider.module.css";

export const Divider: React.FC<Partial<HTMLDivElement>> = ({ ...props }) => {
    // @ts-ignore
    return <div {...props} className={styles.divider} />
};

