import {useRouter} from "next/router";
import "@openline-ai/openline-web-chat/dist/esm/index.css"
import styles from './details-page-layout.module.scss'
import {GraphQLClient} from "graphql-request";
import React, {useEffect, useState} from "react";
import {GetContactTypes} from "../../../services/contactTypeService";
import {Contact, ContactType} from "../../../models/contact";
import {toast} from "react-toastify";
import {GetContactDetails} from "../../../services/contactService";
import {ProfileLayout} from "./ProfileLayout";
import ContactCommunicationSection from "../contactChannels";
import ContactHistory from "../contactHistory";
import ContactNotes from "../note/contactNotes";
import ContactNoteModalTemplate from "../note/contactNoteModalTemplate";
import ContactDetailsSection from "../contactDetailsSection";
import {Divider} from "../../atoms";
import {useGraphQLClient} from "../../../utils/graphQLClient";

// TODO Move atom components to ui-kit
// TODO refactor this so it is layout that can be reused

export const DetailsPageLayout = () => {
    const client =  useGraphQLClient();
    const [reload, setReload] = useState(false);
    const router = useRouter();

    const [reloadDetails, setReloadDetails] = useState(false);
    const [contact, setContact] = useState({
        definitionId: undefined,
        title: '',
        firstName: '',
        lastName: '',
        ownerId: undefined,
        ownerFullName: '',
        contactTypeId: undefined,
        contactTypeName: ''
    }) as any;


    const [contactTypeList, setContactTypeList] = useState([] as any);
    const [editDetails, setEditDetails] = useState(false);
    const getContactObjectFromResponse = (contact: Contact) => {
        return {
            id: contact.id,
            title: contact.title,
            firstName: contact.firstName,
            lastName: contact.lastName,
            ownerId: contact.owner?.id ?? undefined,
            ownerFullName: contact.owner ? contact.owner.firstName + ' ' + contact.owner.lastName : '',
            contactTypeId: contact.contactType?.id ?? undefined,
            contactTypeName: contact.contactType?.name ?? '',
            label: contact.label,
            definitionId: contact.definition?.id
        };
    }


    useEffect(() => {
        if (router.query.id) {
            setEditDetails(false);
            GetContactTypes(client).then((contactTypes: ContactType[]) => {
                setContactTypeList(contactTypes);
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }

        if (router.query.id && router.query.id === 'new') {
            setEditDetails(true);
        } else if (router.query.id && router.query.id !== 'new') {
            GetContactDetails(client, router.query.id as string).then((contact: Contact) => {
                setContact(getContactObjectFromResponse(contact));
                setReloadDetails(false)
            }).catch((reason: any) => {
                //todo log an error in server side
                setReloadDetails(false)
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }

    }, [router.query.id, reloadDetails]);


    // EDITOR
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
                        <Divider/>
                    </>

                )}
                <ContactCommunicationSection contactId={router.query.id}/>
            </section>

            <section className={styles.messageEditorSection}>
                {router.query.id && router.query.id !== 'new' && (
                    <ContactNoteModalTemplate
                        note={{
                            id: undefined,
                            html: ''
                        }}
                        notifyChanged={() => setReload(true)}
                        contactId={router.query?.id as string}
                    />
                )}

            </section>

            <section className={styles.contactHistorySection}>
                {router.query.id && router.query.id !== 'new' && (
                    <>
                        <article>
                            <h2 className="text-gray-900 text-xl">Contact history</h2>
                            <ContactHistory contactId={router.query.id}/>
                        </article>
                        <article>
                            <h2 className="text-gray-900 text-xl">Notes</h2>
                            <ContactNotes contactId={router.query.id} reload={reload} setReload={setReload}/>
                        </article>
                    </>
                )}
            </section>
        </div>
    )
}