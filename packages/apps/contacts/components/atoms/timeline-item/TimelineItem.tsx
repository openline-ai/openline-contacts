import React from 'react';
import styles from './timeline-item.module.scss'
import Moment from "react-moment";
import ReactTimeAgo from "react-time-ago";
interface Props  {
    children: React.ReactNode;
    createdAt: string
    last?: boolean
}

export const TimelineItem: React.FC<Props> = ({ children,  createdAt, last}) => {

    return (
        <div className={`${styles.timelineItem} ${last ? styles.last : ''}`}>

            <span className={styles.timelineLine}/>
            {createdAt && (
                <>
                    <ReactTimeAgo className="text-sm text-gray-500 mb-1" date={new Date(createdAt)} locale="en-US"/>
                    <Moment className="text-sm text-gray-500" date={createdAt} format={'D-M-YYYY h:mm A'}></Moment>
                </>
            )}
            <span className={styles.timelineLine}/>
            <div className={styles.content}>
                {children}
            </div>

        </div>
    )

};

