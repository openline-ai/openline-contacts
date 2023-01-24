import React from "react";

import {Skeleton} from "primereact/skeleton";
import {ConversationTimelineItem, EmailTimelineItem, NoteTimelineItem, PhoneCallTimelineItem} from "../../molecules";
import {TimelineItem} from "../../atoms/timeline-item";

interface Props {
    loading: boolean
    noActivity: boolean
    loggedActivities: Array<any>
}
export const Timeline = ({loading, noActivity, loggedActivities}: Props) => {


    if (loading) {
        return (
            <div className="flex flex-column mt-4">
                <Skeleton className="mb-3" />
                <Skeleton  className="mb-3"/>
                <Skeleton  className="mb-3"/>
                <Skeleton  className="mb-3"/>
                <Skeleton/>
            </div>
        )
    }

    if(!loading && noActivity) {
        return (
            <p className="text-gray-600 font-italic mt-4">
                No activity logged yet
            </p>
        )
    }

    const getTimelineItemByTime = (type: string, data:any) => {
        switch (type) {
            case "NOTE":
                return <NoteTimelineItem noteContent={data.html} createdAt={data.createdAt} />
            case "CONVERSATION":
                return <ConversationTimelineItem feedId={data.id} />
            // case "EMAIL":
            //    return <EmailTimelineItem emailContent={data.html} sender="jane.doe@acme.com" subject="Follow up" recipients={['adam.smith@org.com']}/>
            // case "CALL":
            //     return <PhoneCallTimelineItem phoneCallParties={data} duration={}/>
            default:
                // eslint-disable-next-line react/no-unescaped-entities
                return <div>Sorry, looks like " {type} " activity type is not supported yet </div>
        }
    }

    return (
        <div className="mt-5">
            <div className="text-sm text-gray-500 flex justify-content-center mb-1"> Now </div>
            {
                loggedActivities.map((e: any, index) => (
                    <React.Fragment key={e.id}>
                        <TimelineItem createdAt={new Date(new Date().setDate(new Date().getDate() - (index + 1))).toISOString()} >
                            {getTimelineItemByTime(e.type, e)}
                        </TimelineItem>
                    </React.Fragment>

                ))
            }
        </div>
    )
}
