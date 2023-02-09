import styles from './dashboard-table-header-label.module.scss'
import Link from "next/link";
import React from "react";

export const DashboardTableCell = (
    {label, subLabel, url, className}:
                                       {label:string, subLabel?:any, url?: string, className?: string}) => {
    return (
        <div className='flex flex-column'>
            {url ? (
                <Link href={url}
                      className='cta'>
                    {label}
                </Link>
            ): (
                <span className={className}>{label}</span>
            )}
         
            {subLabel && (
                <span className={styles.subLabel}>{subLabel}</span>
            )}
        </div>
    );
}



export const DashboardTableAddressCell = ({
                            country,
                            state,
                            city,
                        }: {
    country:string | undefined,
    state:string | undefined,
    city:string | undefined,
}) => {
    return (
        <div className={styles.addressContainer}>
            {city && (
                <div className={`${styles.addressCity}`}>
                    {city}
                </div>
            )}

            {(country || state ) && (
                <div className={`${styles.addressState}`}>
                    {state}, {country}
                </div>
            )}
        </div>
    );
};

