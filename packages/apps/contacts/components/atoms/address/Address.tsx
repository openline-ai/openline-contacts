import React from 'react';
import styles from "./address.module.scss";
import {Location as AddressInterface} from "../../../models/location";

interface Props extends Omit<AddressInterface, 'id'> {
    mode?: 'default' | 'light'
}
export const Address = ({
                     place,
                     mode='default'
                 }: Props) => {
    return (
        <div className={styles.addressContainer}>
            {place && place.address && (
                <div className={`${styles.address} ${styles[mode]}`}>{place.address}</div>
            )}
            {place && place.address2 && <div className={`${styles.address} ${styles[mode]}`}>{place.address2}</div>}

            {(place && (place.city || place.state || place.zip)) && (
                <div className={`${styles.address} ${styles[mode]}`}>
                    {place.city}, {place.state} {place.zip}
                </div>
            )}

            {place && place.country && (
                <div className={`${styles.country} ${styles[mode]}`}>{place.country}</div>
            )}

            {(place && (place.phone || place.fax)) && (
                <div className={styles.phoneAndFaxContainer}>
                    {place.phone && (
                        <div className={styles.phone}>
                            <span> Phone: </span> {place.phone}
                        </div>)}
                    {place.fax && <div className={styles.fax}>
                        <span> Fax: </span>  {place.fax}
                    </div>}
                </div>
            )}
        </div>
    );
};

