import React from 'react';
import styles from "./address.module.scss";
import {Address as AddressInterface} from "../../../models/Address";

export const Address = ({
                     country,
                     state,
                     city,
                     address,
                     address2,
                     zip,
                     phone,
                     fax,
                 }: Omit<AddressInterface, 'id'>) => {
    return (
        <div className={styles.addressContainer}>
            {address && (
                <div className={styles.address}>{address}</div>
            )}
            {address2 && <div className={styles.address}>{address2}</div>}

            {(city || state || zip) && (
                <div className={styles.address}>
                    {city}, {state} {zip}
                </div>
            )}

            {country && (
                <div className={styles.country}>{country}</div>
            )}

            {(phone || fax) && (
                <div className={styles.phoneAndFaxContainer}>
                    {phone && (
                        <div className={styles.phone}>
                            <span> Phone: </span> {phone}
                        </div>)}
                    {fax && <div className={styles.fax}>
                        <span> Fax: </span>  {fax}
                    </div>}
                </div>
            )}
        </div>
    );
};

