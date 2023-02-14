import React from 'react';
import styles from './app-action-timeline-item.module.scss'
import Image from "next/image";
import Moment from "react-moment";

interface Props {
    className?: string
    first?: string
    actionAt?: string
    actionName?: string
}

export const AppActionTimelineItem = (
    {
        className,
        first,
        actionAt,
        actionName,
        ...rest
    }: Props
): JSX.Element => {

    return (
        <div className={`${styles.timelineItem} minimal-width}`}>

            <span className={`${!first ? styles.timelineLine : ''}`}/>

            <div className={styles.content} {...rest}>
                <div className={styles.x}>

                    <Image
                        alt=""
                        src={`/images/created.svg`}
                        priority={true}
                        unoptimized={true}
                        width={25}
                        height={25}
                        className='mr-3'
                    />
                    <article className={`${styles.actionContainer}`}>
                        <div className="flex align-items-center">

                            <div className="mr-1 text-gray-700" style={{lineHeight: '18px', fontSize: '15px'}}>
                                <p className='p-0 m-0'>{actionName}</p>
                                <p className='p-0 m-0'>on <Moment className="text-gray-700" date={actionAt} format={'D MMM YYYY'}/> at <Moment className="text-gray-700" date={actionAt} format={'h:mm A'} /> CET</p>
                            </div>

                        </div>

                    </article>
                </div>
            </div>
        </div>
    )

};

