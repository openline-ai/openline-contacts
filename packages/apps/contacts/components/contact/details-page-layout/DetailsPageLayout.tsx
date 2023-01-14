import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import "@openline-ai/openline-web-chat/dist/esm/index.css"
import styles from './details-page-layout.module.scss'
import {generateGradient} from "./utils";
import {GraphQLClient} from "graphql-request";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {GetContactTypes} from "../../../services/contactTypeService";
import {Contact, ContactType} from "../../../models/contact";
import {toast} from "react-toastify";
import {CreateContact, GetContactDetails, UpdateContact} from "../../../services/contactService";
import {
    CustomFieldTemplateProps,
    EntityDefinitionTemplateProps, FieldSetTemplateProps,
    mapEntityExtensionDataFromFormData
} from "../../generic/entityExtensionTemplates";
import {GetUsersPage} from "../../../services/userService";
import {Page, PaginationOf} from "../../../models/pagination";
import {User} from "../../../models/user";
import {GetEntityDefinitions} from "../../../services/entityDefinitionService";
import {CustomField, CustomFieldDefinition, EntityDefinition, FieldSetDefinition} from "../../../models/customFields";
import {ProfileLayout} from "./ProfileLayout";
import ContactCommunicationSection from "../contactChannels";
import ContactHistory from "../contactHistory";
import ContactNotes from "../note/contactNotes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage} from "@fortawesome/free-solid-svg-icons";
import ContactNoteModalTemplate from "../note/contactNoteModalTemplate";
import ContactDetailsSection from "../contactDetailsSection";
import {Divider} from "../../atoms";

// TODO Move atom components to ui-kit
// TODO refactor this so it is layout that can be reused

export const DetailsPageLayout = () => {
    const {data: session} = useSession();
    const client = new GraphQLClient(`/customer-os-api/query`);
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

    const {register, handleSubmit, setValue, control} = useForm();

    const [contactTypeList, setContactTypeList] = useState([] as any);
    const [editDetails, setEditDetails] = useState(false);

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
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }

    }, [router.query.id, reloadDetails]);

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

    const onSubmit = handleSubmit(data => {
        let entityExtension = mapEntityExtensionDataFromFormData(data, entityDefinitionTemplateData);

        data.customFields = entityExtension.customFields;
        data.fieldSets = entityExtension.fieldSets;

        if (!data.id) {
            CreateContact(client, data).then((savedContact: Contact) => {
                router.push('/contact/' + savedContact.id);
                toast.success("Contact added successfully!");
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        } else {
            UpdateContact(client, data).then((savedContact: Contact) => {
                setReloadDetails(!reloadDetails);
                toast.success("Contact updated successfully!");
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }
    });

    const searchOwner = function (where: any, maxResults: string) {
        return new Promise((resolve, reject) => {
            GetUsersPage(client, PaginationOf(), where).then((response: Page<User>) => {
                resolve(response);
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
                reject(reason);
            });
        });
    }

    const [entityDefinitionTemplateData, setEntityDefinitionTemplateData] = useState({} as EntityDefinitionTemplateProps);

    const contactTypeChanged = (selectedContactTypeId: string) => {
        if (router.query.id !== 'new') {
            return;
        }

        let selectedContactType = contactTypeList.filter((f: ContactType) => f.id === selectedContactTypeId)[0].name;
        let definitionName = '';
        switch (selectedContactType) {
            case 'Customer':
                definitionName = "CONTACT_CUSTOMER";
                break;
            case 'Clinic':
                definitionName = "CONTACT_CLINIC";
                break;
        }

        if (selectedContactType !== '') {
            GetEntityDefinitions(client, "CONTACT").then((ed: EntityDefinition[]) => {
                let entityDefinitionsFiltered = ed.filter((e: EntityDefinition) => e.name === definitionName);
                let entityDefinitionsSelected = undefined;
                if (entityDefinitionsFiltered.length === 1) {
                    entityDefinitionsSelected = entityDefinitionsFiltered[0];

                    setValue('definitionId', entityDefinitionsSelected.id);
                } else {
                    return;
                }

                if (router.query.id === 'new') {
                    const obj = {} as EntityDefinitionTemplateProps;
                    obj.register = register;
                    obj.fields = entityDefinitionsSelected.fields.map((f: (CustomFieldDefinition | FieldSetDefinition)) => {
                        if ((f as CustomFieldDefinition).type) {
                            return customFieldDefinitionToTemplateProps(f as CustomFieldDefinition);
                        } else {
                            const fieldSet = f as FieldSetDefinition;
                            return {
                                id: `fieldSet_${fieldSet.id}`,
                                definitionId: fieldSet.id,
                                name: fieldSet.name,
                                customFields: fieldSet.customFields.map((f: CustomFieldDefinition) => customFieldDefinitionToTemplateProps(f as CustomFieldDefinition, fieldSet.id)),
                                register: register
                            } as FieldSetTemplateProps;
                        }
                    });

                    setEntityDefinitionTemplateData(obj);
                }
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }
    }

    const customFieldDefinitionToTemplateProps = (
        f: CustomFieldDefinition,
        fieldSetId: string | undefined = undefined,
        data: CustomField | undefined = undefined
    ): CustomFieldTemplateProps => {
        return {
            id: fieldSetId ? `fieldSet_${fieldSetId}_customField_${data ? data.id : f.id}` : `customField_${data ? data.id : f.id}`,
            definition: f,
            data: data ?? {
                id: undefined,
                name: f.name,
                datatype: f.type,
                definitionId: f.id,
                value: undefined
            },
            register: register
        } as CustomFieldTemplateProps;
    }

    // EDITOR
    const richTextHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-strike" aria-label="Strike"></button>

                <button className="ql-link" aria-label="Link"></button>
                <button className="ql-code-block" aria-label="Code block"></button>
                <button className="ql-blockquote" aria-label="Blockquote"></button>

                <button id="custom-button" type={"button"} aria-label="Insert picture" onClick={() => null}>
                    <FontAwesomeIcon size="xs" icon={faImage} style={{color: '#6c757d'}}/>
                </button>

                <input
                    type="file"
                    onChange={() => null}
                    style={{display: 'none'}}
                />

            </span>
        );
    }
    return (
        <div className={styles.pageWrapper}>
            <ProfileLayout editMode={editDetails} onSetEditMode={setEditDetails}/>

            <section className={styles.contactFieldSection}>
                {editDetails && (
                    <>
                        <ContactDetailsSection 
                            editDetails={editDetails}
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
                ) }

            </section>

            <section className={styles.contactHistorySection} >
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