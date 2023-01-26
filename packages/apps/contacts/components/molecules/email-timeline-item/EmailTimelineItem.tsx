import React, {useState} from 'react';
import styles from './email-timeline-item.module.scss'
import {Button} from "../../atoms";
interface Props  {
    emailContent: string
    sender: string
    recipients: string | Array<string>
    subject: string
}

export const EmailTimelineItem: React.FC<Props> = (
    { emailContent, sender,recipients, subject}
) => {
    const [expanded, toggleExpanded] = useState(false)

    return (
        <article className={`${styles.emailContainer}`}>
                <div className={styles.emailData}>
                    <div className="flex">
                        <div className={styles.emailDataColumn}>
                            <span className={styles.emailParty}>From:</span>
                            <span className={styles.emailParty}>To:</span>
                            <span className={styles.emailParty}>Subject:</span>
                        </div>
                        <div className={styles.emailDataColumn}>
                            <span>{sender}</span>
                            <div>
                                {typeof recipients === "string" ? recipients : recipients.map((recipient) => (
                                    <span className={styles.emailRecipient} key={recipient}>
                                    {recipient}
                                </span>
                                ))}
                            </div>
                            <span>{subject}</span>
                        </div>
                    </div>


                    <div className={styles.stamp}>
                        <div/>
                    </div>

                </div>
                <div className={`${styles.emailContentContainer} ${!expanded ? styles.eclipse : ''}`} style={{maxHeight: expanded ? 'fit-content' : '80px'}}>
                    <div className={`text-overflow-ellipsis ${styles.emailContent}`} dangerouslySetInnerHTML={{__html: emailContent}}></div>
                    {!expanded && (
                        <div className={styles.eclipse}/>
                    )}
                </div>
                <div className={styles.toggleExpandButton}>
                    <Button onClick={() => toggleExpanded(!expanded)} mode="link">
                        {expanded ? "Collapse" : "Expand"}
                    </Button>
                </div>


        </article>
    )

};

