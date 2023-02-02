import React from 'react';
import styles from './web-action-timeline-item.module.scss'
import {ContactWebAction} from "../../../models/contact";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import Link from "next/link";
import {capitalizeFirstLetter} from "../../../utils/capitalizeFirstLetter";

interface Props extends ContactWebAction {
    contactName?: string
}

export const WebActionTimelineItem = (
    {
        startedAt,
        pageTitle,
        pageUrl,
        application,
        engagedTime,
        contactName,
        ...rest
    }: Props
): JSX.Element => {

    return (
        <div className={styles.x}>
            <FontAwesomeIcon icon={faGlobe}
                             style={{ width: '40px', fontSize:'1.6rem' }}
                             className="mr-2 text-gray-700"
            />
            <article className={`${styles.actionContainer}`}>
                <div className="flex align-items-center">

                    <div>
                        {contactName && (
                            <div className="text-gray-700">
                                {contactName}
                            </div>
                        )}

                        <div>
                            <span className="mr-1 text-gray-700">Visited: </span>
                            <Link href={pageUrl} style={{fontWeight: "bolder"}} className="overflow-hidden text-overflow-ellipsis">
                                {pageTitle}
                            </Link>
                        </div>


                        <div className="flex text-gray-700">
                            <span className="mr-2 font-bolder text-gray-700">
                                Duration:
                            </span>

                            <span>{engagedTime ? engagedTime : "-"} {" "} minutes</span>
                        </div>
                    </div>

                </div>
                <div>
                    <div className="flex flex-column">
                        <div>
                              <span className="mr-2 font-bolder text-gray-700">
                                Started at:
                              </span>
                            <Moment className="text-gray-700" date={startedAt} format={'D-M-YYYY h:mm A'}/>
                        </div>
                    </div>
                    <div>
                        <span className="mr-1 text-gray-700 font-bolder">Accessed from: </span>
                        <span className={styles.actionDevice}>
                            {application ? capitalizeFirstLetter(application) : '-'}
                        </span>
                    </div>

                </div>

            </article>
        </div>

    )

};

