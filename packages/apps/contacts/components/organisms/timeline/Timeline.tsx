import React from "react";
import {Skeleton} from "primereact/skeleton";
import {ConversationTimelineItem, NoteTimelineItem, WebActionTimelineItem} from "../../molecules";
import {TimelineItem} from "../../atoms/timeline-item";
import {AppActionTimelineItem} from "../../molecules/app-action-timeline-item";

interface Props {
    loading: boolean
    noActivity: boolean
    contactId?: string
    loggedActivities: Array<any>
    notifyChange?: (id: any) => void
    notifyContactNotesUpdate?: (id: any) => void
}

export const Timeline = ({
                             loading,
                             noActivity,
                             loggedActivities,
                             contactId,
                             notifyChange = () => null,
                             notifyContactNotesUpdate = () => null,
                         }: Props) => {
    if (loading) {
        return (
            <div className="flex flex-column mt-4">
                <Skeleton className="mb-3"/>
                <Skeleton className="mb-3"/>
                <Skeleton className="mb-3"/>
                <Skeleton className="mb-3"/>
                <Skeleton/>
            </div>
        )
    }

    if (!loading && noActivity) {
        return (
            <p className="text-gray-600 font-italic mt-4">
                No activity logged yet
            </p>
        )
    }
    const getTimelineItemByTime = (type: string, data: any, index: number) => {
        switch (type) {
            case "NOTE":
                return <TimelineItem first={index == 0} createdAt={data?.createdAt}>
                    <NoteTimelineItem
                        noteContent={data.html}
                        createdAt={data.createdAt}
                        createdBy={data?.createdBy}
                        id={data.id}
                        source={data?.source}
                        refreshNoteData={data?.contact ? notifyContactNotesUpdate : notifyChange}
                        contactId={contactId}
                    />
                </TimelineItem>
            case "CONVERSATION":
                return <ConversationTimelineItem first={index == 0} feedId={data.id} source={data.source} createdAt={data?.createdAt}/>
            case "ACTION":
                return (
                    <TimelineItem first={index == 0} createdAt={data?.createdAt}>
                        <WebActionTimelineItem {...data} />
                    </TimelineItem>
                )
            case "APP_ACTION":
                return (
                    <AppActionTimelineItem first={index == 0} createdAt={data?.createdAt}  {...data} />
                )
            // case "CALL":
            //     return <PhoneCallTimelineItem phoneCallParties={data} duration={}/>
            default:
                // eslint-disable-next-line react/no-unescaped-entities
                return type ? (<div>Sorry, looks like " {type} " activity type is not supported yet </div>) : ''
        }
    }

    return (
        <div className="mb-3">
            {
                loggedActivities.map((e: any, index) => (
                    <React.Fragment key={e.id}>
                        {getTimelineItemByTime(e.type, e, index)}
                    </React.Fragment>

                ))
            }
        </div>
    )
}
