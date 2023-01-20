import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faPhone} from "@fortawesome/free-solid-svg-icons";
import styles from './organisation.module.scss'
export const OrganizationContactList = ({contacts = []}: {contacts: any}) => {

    return (
            <ul className={styles.contactList}>
                {[...contacts].map((e:any)=> (
                    <li key={e.id}
                        className={`text-gray-600 line-height-2 pt-3 pb-3 ${styles.listItem}`}>
                        <div>
                            <span> {e.firstName} </span>
                            <span> {e.lastName} </span>
                        </div>
                        <div className={`mb-2 ${styles.contactType}`}>
                            <span> {e.contactType?.name}</span>

                            </div>
                            <div className="flex">
                                {!!e.phoneNumbers.length && (
                                    <>
                                        <span className="mr-2"> <FontAwesomeIcon icon={faPhone}/> </span>
                                        {}
                                        {e.phoneNumbers.find((d:any ) => d.primary)?.e164 || e.phoneNumbers[0]?.e164}
                                    </>
                                )}


                            </div>
                            <div className="flex">
                                {!!e.emails.length && (
                                    <>
                                        <span className="mr-2"> <FontAwesomeIcon icon={faEnvelope}/> </span>
                                        {e.emails.find((d:any ) => d.primary)?.email || e.emails[0]?.email }
                                    </>
                                )}

                            </div>
                    </li>
                ))}
            </ul>
    );
}
