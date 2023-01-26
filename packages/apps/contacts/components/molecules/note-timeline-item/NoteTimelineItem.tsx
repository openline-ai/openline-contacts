import React, {ReactNode} from 'react';
import styles from './note.module.scss'
import Moment from "react-moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbtack} from "@fortawesome/free-solid-svg-icons";
interface Props  {
    noteContent: string
    createdAt: string
    createdBy?: {
        firstName?: string
        lastName?: string
    }
}

export const NoteTimelineItem: React.FC<Props> = ({ noteContent, createdBy, createdAt}) => {

    return (
        <div className={styles.noteContainer}>
                 <FontAwesomeIcon icon={faThumbtack}  className={styles.pin}/>
                <div className={`${styles.noteContent}`} dangerouslySetInnerHTML={{__html: noteContent}}></div>
                <div className={styles.noteData}>
                    {/*<Moment className="text-sm text-gray-600" date={createdAt} format={'HH:mm d MMM yy'}>{createdAt}</Moment>*/}
                    <div className="text-sm text-gray-600"> {createdBy?.firstName} {" "} {createdBy?.lastName}</div>
                </div>
        </div>
    )

};

