import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faPhone} from "@fortawesome/free-solid-svg-icons";
import styles from './organisation.module.scss'
import {useRouter} from "next/router";
export const OrganizationContactList = ({contacts = []}: {contacts: any}) => {
    const router = useRouter();

    if(contacts.length === 0) {
        return (
            <p className="text-gray-600 font-italic mt-4">
                No contacts in this organisation
            </p>
        )
    }

    return (
            <ul className={styles.contactList}>
                {[...contacts].map((e:any)=> (
                    <li key={e.id}
                        onClick={() => router.push(`/contact/${e.id}`)}
                        className={`text-gray-800 line-height-2 pt-3 pb-3 ${styles.listItem}`}>
                        <div>
                            <span> {e.firstName} </span>
                            <span> {e.lastName} </span>
                            <span className="text-xs ml-2 text-gray-600"> {e?.jobTitle}</span>
                        </div>
                        <div className={`mb-2 ${styles.contactType}`}>
                            <span> {e.contactType?.name}</span>

                            </div>
                            <div className="flex">
                                {!!e.phoneNumbers.length && (
                                    <>
                                        <span className="mr-2"> <FontAwesomeIcon icon={faPhone}/> </span>
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
