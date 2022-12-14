import {useRouter} from "next/router";
import {GraphQLClient} from "graphql-request";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faUserNinja} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {Controller, useForm} from "react-hook-form";
import {getEnumLabel} from "../../model/enums";
import {ContactTitleEnum} from "../../model/enum-contactTitle";
import {InputTextarea} from "primereact/inputtextarea";
import SearchComponent from "../generic/SearchComponent";
import {CreateContact, DeleteContact, GetContactDetails, UpdateContact} from "../../services/contactService";
import {Contact, ContactType} from "../../models/contact";
import {GetContactTypes} from "../../services/contactTypeService";
import {GetUsersPage} from "../../services/userService";
import {Page, PaginationOf} from "../../models/pagination";
import {User} from "../../models/user";
import PropTypes from "prop-types";
import {GetEntityDefinitions} from "../../services/entityDefinitionService";
import {CustomField, CustomFieldDefinition, EntityDefinition, FieldSetDefinition} from "../../models/customFields";
import {CustomFieldTemplateProps, EntityDefinitionEditTemplate, EntityDefinitionTemplateProps, FieldSetTemplateProps, mapEntityExtensionDataFromFormData} from "../generic/entityExtensionTemplates";
import {toast} from "react-toastify";

export default function ContactDetailsSection(props: any) {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const router = useRouter();

    const [reloadContactDetails, setReloadContactDetails] = useState(false);
    const [contact, setContact] = useState({
        definitionId: undefined,
        title: '',
        firstName: '',
        lastName: '',
        ownerId: undefined,
        ownerFullName: '',
        contactTypeId: undefined,
        contactTypeName: '',
        label: '',
        notes: ''
    }) as any;

    const {register, handleSubmit, setValue, control} = useForm();

    const [contactTypeList, setContactTypeList] = useState([] as any);
    const [editDetails, setEditDetails] = useState(false);

    useEffect(() => {
        if (props.contactId) {
            setEditDetails(false);

            GetContactTypes(client).then((contactTypes: ContactType[]) => {
                setContactTypeList(contactTypes);
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }

        if (props.contactId && props.contactId === 'new') {
            setEditDetails(true);
        } else if (props.contactId && props.contactId !== 'new') {
            GetContactDetails(client, props.contactId).then((contact: Contact) => {
                setContact(getContactObjectFromResponse(contact));
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }

    }, [props.contactId, reloadContactDetails]);

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
            notes: contact.notes,
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
                setReloadContactDetails(!reloadContactDetails);
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
        if (props.contactId !== 'new') {
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

                if (props.contactId === 'new') {
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

    return (
        <div className="card-fieldset" style={{width: '25rem'}}>
            <div className="card-header">
                <div className="flex flex-row w-full">
                    <div className="flex-grow-1">Contact details</div>
                    <div className="flex">
                        {
                            !editDetails &&
                            <Button className="p-button-text p-0" onClick={() => {
                                setValue('id', contact.id);
                                setValue('title', contact.title);
                                setValue('firstName', contact.firstName);
                                setValue('lastName', contact.lastName);
                                setValue('ownerId', contact.ownerId);
                                setValue('ownerFullName', contact.ownerFullName);
                                setValue('contactTypeId', contact.contactTypeId);
                                setValue('contactTypeName', contact.contactTypeName);
                                setValue('label', contact.label);
                                setValue('notes', contact.notes);
                                setValue('definitionId', contact.definitionId);
                                setEditDetails(true);
                            }}>
                                <FontAwesomeIcon size="xs" icon={faEdit} style={{color: 'black'}}/>
                            </Button>
                        }
                    </div>
                </div>
            </div>
            <div className="card-body">

                {
                    !editDetails &&
                    <div className="display">
                        <div className="grid grid-nogutter">
                            <div className="col-4">Title</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{getEnumLabel(ContactTitleEnum, contact.title)}</div>
                        </div>
                        <div className="grid grid-nogutter mt-3">
                            <div className="col-4">First name</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.firstName}</div>
                        </div>
                        <div className="grid grid-nogutter mt-3">
                            <div className="col-4">Last name</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.lastName}</div>
                        </div>
                        <div className="grid grid-nogutter mt-3">
                            <div className="col-4">Owner</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.ownerFullName}</div>
                        </div>
                        <div className="grid grid-nogutter mt-3">
                            <div className="col-4">Type</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.contactTypeName}</div>
                        </div>
                        <div className="grid grid-nogutter mt-3">
                            <div className="col-4">Label</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.label}</div>
                        </div>
                        <div className="grid grid-nogutter mt-3">
                            <div className="col-4">Notes</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.notes}</div>
                        </div>
                    </div>
                }

                {
                    editDetails &&
                    <div className="content">
                        <form>
                            <div className="field w-full">
                                <label htmlFor="lastName" className="block">Title</label>
                                <Controller name="title" control={control} render={({field}) => (
                                    <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={ContactTitleEnum}
                                              optionValue="value" optionLabel="label" className="w-full"/>
                                )}/>
                            </div>
                            <div className="field w-full">
                                <label htmlFor="firstName" className="block">First name</label>
                                <InputText id="firstName" {...register("firstName")} className="w-full"/>
                            </div>
                            <div className="field w-full">
                                <label htmlFor="lastName" className="block">Last name</label>
                                <InputText id="lastName" {...register("lastName")} className="w-full"/>
                            </div>
                            <div className="field w-full">
                                <label htmlFor="ownerFullName" className="block">Owner</label>
                                <Controller name="ownerFullName" control={control} render={({field}) => (
                                    <SearchComponent
                                        resourceLabel="users"
                                        value={field.value}
                                        searchBy={[{label: 'First name', field: 'FIRST_NAME'}, {label: 'Last name', field: 'LAST_NAME'}]}
                                        searchData={(where: any, maxResults: string) => {
                                            return searchOwner(where, maxResults);
                                        }}
                                        itemTemplate={(e: any) => {
                                            return <>
                                                <span className="mr-3"><FontAwesomeIcon icon={faUserNinja}/></span>
                                                <span className="mr-3">{e.firstName} {e.lastName}</span>
                                            </>
                                        }}
                                        onItemSelected={(e: any) => {
                                            setValue('ownerId', !e ? undefined : e.id);
                                            setValue('ownerFullName', !e ? 'empty' : (e.firstName + ' ' + e.lastName));
                                        }}
                                        maxResults={5}/>
                                )}/>
                            </div>
                            <div className="field w-full">
                                <label htmlFor="contactTypeId" className="block">Type</label>

                                {
                                    contact.id &&
                                    <InputText id="contactTypeName" {...register("contactTypeName")} className="w-full" readOnly={true}/>
                                }
                                {
                                    !contact.id &&
                                    <Controller name="contactTypeId" control={control} render={({field}) => (
                                        <Dropdown id={field.name} value={field.value} onChange={(e) => {
                                            field.onChange(e.value);
                                            contactTypeChanged(e.value);
                                        }} options={contactTypeList}
                                                  optionValue="id" optionLabel="name" className="w-full"/>
                                    )}/>
                                }

                            </div>
                            <div className="field w-full">
                                <label htmlFor="label" className="block">Label</label>
                                <InputText id="label" {...register("label")} className="w-full"/>
                            </div>
                            <div className="field w-full">
                                <label htmlFor="notes" className="block">Notes</label>
                                <InputTextarea id="notes" rows={2} {...register("notes")} autoResize className="w-full"/>
                            </div>

                            {
                                props.contactId === 'new' && entityDefinitionTemplateData.fields && entityDefinitionTemplateData.fields.length > 0 &&
                                <EntityDefinitionEditTemplate fields={entityDefinitionTemplateData.fields} register={register}/>
                            }

                        </form>

                        <div className="flex justify-content-end">
                            <Button onClick={(e: any) => setEditDetails(e.value)} className='p-button-link text-gray-600' label="Cancel"/>
                            <Button onClick={() => onSubmit()} label="Save"/>
                        </div>
                    </div>
                }

            </div>
        </div>
    );
}

ContactDetailsSection.propTypes = {
    contactId: PropTypes.string || undefined
}
