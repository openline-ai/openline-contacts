import React from 'react';
import styles from './web-action-timeline-item.module.scss'
import {ContactWebAction} from "../../../models/contact";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import Link from "next/link";
import {capitalizeFirstLetter} from "../../../utils/capitalizeFirstLetter";

interface Props extends ContactWebAction {
    id: string
}

export const WebActionTimelineItem = (
    {
        startedAt,
        pageTitle,
        pageUrl,
        application,
        engagedTime,
        ...rest
    }: Props
): JSX.Element => {

    return (
        <article className={`${styles.actionContainer}`}>
            <div className="flex align-items-center">
                <FontAwesomeIcon icon={faGlobe}
                                 style={{ width: '40px', fontSize:'1.6rem' }}
                                 className="mr-2 text-gray-700"
                />
                <div>
                    <div>
                        <span className="mr-1 text-gray-700">Visited: </span>
                        <Link href={pageUrl} style={{fontWeight: "bolder"}}>
                            {pageTitle}
                        </Link>
                    </div>


                    <div className="flex text-gray-700 mt-1">
                        <span className="mr-2 font-bolder text-gray-700">
                            Duration:
                        </span>

                        <span>{engagedTime} {" "} minutes</span>
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
                    <div className="mt-1">
                        <span className="mr-1 text-gray-700 font-bolder">Accessed from: </span>
                        <span className={styles.actionDevice}>
                            {capitalizeFirstLetter(application)}
                        </span>
                    </div>
                </div>
        </article>
    )

};

