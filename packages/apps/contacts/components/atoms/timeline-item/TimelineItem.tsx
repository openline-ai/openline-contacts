import React from 'react';
import styles from './timeline-item.module.scss'
import Moment from "react-moment";
import ReactTimeAgo from "react-time-ago";
interface Props  {
    children: React.ReactNode;
    createdAt?: string | number
    first?: boolean
    style?: any
    className?: string
}

export const TimelineItem: React.FC<Props> = ({ children,  createdAt, first, className, ...rest}) => {

    return (
        <div className={`${styles.timelineItem} ${className ?? ''}`}>

            <span className={`${!first ? styles.timelineLine : ''}`}/>
            {createdAt ? (
                <>
                    <ReactTimeAgo className="text-sm text-gray-500 mb-1" date={new Date(createdAt)} locale="en-US"/>
                    <Moment className="text-sm text-gray-500" date={createdAt} format={'D-M-YYYY h:mm A'}></Moment>
                </>
            ) : 'Date not available'}
            <div className={styles.content} {...rest}>
                {children}
            </div>

        </div>
    )

};

