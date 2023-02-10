import {useRouter} from "next/router";
import "@openline-ai/openline-web-chat/dist/esm/index.css"
import styles from './details-page-layout.module.scss'
import React, {useEffect, useState} from "react";
import {Contact, ContactTag} from "../../../models/contact";
import {toast} from "react-toastify";
import {GetContactDetails} from "../../../services/contactService";
import {ProfileLayout} from "./ProfileLayout";
import ContactCommunicationSection from "../contactChannels";
import ContactHistory from "../contactHistory";
import ContactNoteModalTemplate from "../note/contactNoteModalTemplate";
import ContactDetailsSection from "../contactDetailsSection";
import {Divider} from "../../atoms";
import {useGraphQLClient} from "../../../utils/graphQLClient";
import {CardHeading} from "../../atoms/cardHeading";

// TODO Move atom components to ui-kit
// TODO refactor this so it is layout that can be reused

export const DetailsPageLayout = () => {
    const client =  useGraphQLClient();
    const router = useRouter();

    const [reloadDetails, setReloadDetails] = useState(false);
    const [reloadNotes, setReloadNotes] = useState(false);
    const [contact, setContact] = useState({
        definitionId: undefined,
        title: undefined,
        firstName: '',
        lastName: '',
        ownerId: undefined,
        ownerFullName: '',
        label: "",
    }) as any;

    const [editDetails, setEditDetails] = useState(false);
    const getContactObjectFromResponse = (contact: Contact) => {

        return {
            id: contact.id,
            title: contact.title || undefined,
            firstName: contact.firstName,
            lastName: contact.lastName,
            ownerId: contact.owner?.id ?? undefined,
            ownerFullName: contact.owner ? contact.owner.firstName + ' ' + contact.owner.lastName : '',
            label: contact.label,
            definitionId: contact.definition?.id,
            source: contact.source,
            tags: contact.tags
        };
    }

    useEffect(() => {
        if (router.query.id) {
            setEditDetails(false);
        }

        if (router.query.id && router.query.id === 'new') {
            setEditDetails(true);
        } else if (router.query.id && router.query.id !== 'new') {
            GetContactDetails(
                client,
                router.query.id as string
            ).then((contact: Contact) => {
                setContact(getContactObjectFromResponse(contact));
                setReloadDetails(false)
            }).catch((reason: any) => {
                //todo log an error in server side
                setReloadDetails(false)
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }

    }, [router.query.id, reloadDetails]);

    return (
        <div className={styles.pageWrapper}>
            <ProfileLayout
                contact={contact}
                onSetEditMode={setEditDetails}/>

            <section className={styles.contactFieldSection}>
                {editDetails && (
                    <>
                        <ContactDetailsSection
                            contact={contact}
                            editDetails={editDetails}
                            setReloadDetails={setReloadDetails}
                            setEditDetails={setEditDetails}
                            contactId={router.query.id as string}/>
                        {router.query.id && router.query.id !== 'new' && (
                            <Divider/>
                            )}
                    </>

                )}
                {router.query.id && router.query.id !== 'new' && (
                    <ContactCommunicationSection contactId={router.query.id}/>
                )}
            </section>

            <section className={styles.messageEditorSection}>
                {router.query.id && router.query.id !== 'new' && (
                    <ContactNoteModalTemplate
                        note={{
                            id: undefined,
                            html: ''

                        }}
                        notifyChanged={() => setReloadNotes(true)}
                        contactId={router.query?.id as string}

                    />
                )}

            </section>

            <section className={styles.contactHistorySection}>
                {router.query.id && router.query.id !== 'new' && (
                        <ContactHistory
                            contactId={router.query.id}
                            reload={reloadNotes}
                            setReload={setReloadNotes}
                        />
                )}
            </section>
        </div>
    )
}