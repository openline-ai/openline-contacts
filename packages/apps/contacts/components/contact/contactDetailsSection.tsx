import {useRouter} from "next/router";
import {InputText} from "primereact/inputtext";
import {Button} from "../atoms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserNinja} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {Controller, useForm} from "react-hook-form";
import {ContactTitleEnum} from "../../model/enum-contactTitle";
import SearchComponent from "../generic/SearchComponent";
import {CreateContact, UpdateContact} from "../../services/contactService";
import {Contact, ContactTag} from "../../models/contact";
import {GetUsersPage} from "../../services/userService";
import {Page, PaginationOf} from "../../models/pagination";
import {User} from "../../models/user";
import PropTypes from "prop-types";
import {EntityDefinitionEditTemplate, EntityDefinitionTemplateProps, mapEntityExtensionDataFromFormData} from "../generic/entityExtensionTemplates";
import {toast} from "react-toastify";
import {useGraphQLClient} from "../../utils/graphQLClient";
import {ContactTags} from "./contact-tags/ContactTags";


interface Props {
    editDetails:boolean
     setEditDetails: (state: boolean) => void
    setReloadDetails: (state: boolean) => void
    contactId: string
    contact:any
}
export default function ContactDetailsSection({editDetails, setEditDetails, contactId, contact, setReloadDetails}: Props) {
    const client =  useGraphQLClient();
    const router = useRouter();
    const {register, handleSubmit, setValue, control, reset} = useForm();

    useEffect(() => {
        if(editDetails && router.query.id !== 'new') {

            reset({
                title: contact?.title,
                firstName: contact.firstName || '',
                lastName: contact.lastName || '',
                label: contact?.label,
                ownerId: contact?.ownerId,
                notes: contact?.notes,
                definitionId: contact?.definitionId,
                customFields: contact?.customFields || [],
                fieldSets: contact.fieldSets || [],
            })
        }

    },[editDetails])


    const onSubmit = handleSubmit(data => {
        let entityExtension = mapEntityExtensionDataFromFormData(data, entityDefinitionTemplateData);

        data.customFields = entityExtension.customFields;
        data.fieldSets = entityExtension.fieldSets;

        if (contactId === 'new') {
            CreateContact(client, data).then((savedContact: Contact) => {
                router.push('/contact/' + savedContact.id);
                toast.success("Contact added successfully!");
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        } else {
            UpdateContact(client, {id: contactId, ...data}).then((savedContact: Contact) => {
                setEditDetails(false)
                setReloadDetails(true)
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

    // #240 custom fields should remain hidden
        // const contactTypeChanged = (selectedContactTypeId: string) => {
        // const selectedContactType = contactTypeList.filter((f: ContactType) => f.id === selectedContactTypeId)[0].name;
        // let definitionName = '';
        // switch (selectedContactType) {
        //     case 'Customer':
        //         definitionName = "CONTACT_CUSTOMER";
        //         break;
        //     case 'Clinic':
        //         definitionName = "CONTACT_CLINIC";
        //         break;
        // }
        // if (selectedContactType !== '') {
        //     GetEntityDefinitions(client, "CONTACT").then((ed: EntityDefinition[]) => {
        //         let entityDefinitionsFiltered = ed.filter((e: EntityDefinition) => e.name === definitionName);
        //         let entityDefinitionsSelected = undefined;
        //         if (entityDefinitionsFiltered.length === 1) {
        //             entityDefinitionsSelected = entityDefinitionsFiltered[0];
        //
        //             setValue('definitionId', entityDefinitionsSelected.id);
        //         } else {
        //             return;
        //         }
        //
                // // if (contactId === 'new') {
                //     const obj = {} as EntityDefinitionTemplateProps;
                //     obj.register = register;
                //     obj.fields = entityDefinitionsSelected.fields.map((f: (CustomFieldDefinition | FieldSetDefinition)) => {
                //         if ((f as CustomFieldDefinition).type) {
                //             return customFieldDefinitionToTemplateProps(f as CustomFieldDefinition);
                //         } else {
                //             const fieldSet = f as FieldSetDefinition;
                //             return {
                //                 id: `fieldSet_${fieldSet.id}`,
                //                 definitionId: fieldSet.id,
                //                 name: fieldSet.name,
                //                 customFields: fieldSet.customFields.map((f: CustomFieldDefinition) => customFieldDefinitionToTemplateProps(f as CustomFieldDefinition, fieldSet.id)),
                //                 register: register
                //             } as FieldSetTemplateProps;
                //         }
                //     });
                //
                //     setEntityDefinitionTemplateData(obj);
                // // }
            // }).catch((reason: any) => {
            //     //todo log an error in server side
            //     toast.error("There was a problem on our side and we are doing our best to solve it!");
            // });
        // }
    // }
    // const customFieldDefinitionToTemplateProps = (
    //     f: CustomFieldDefinition,
    //     fieldSetId: string | undefined = undefined,
    //     data: CustomField | undefined = undefined
    // ): CustomFieldTemplateProps => {
    //     return {
    //         id: fieldSetId ? `fieldSet_${fieldSetId}_customField_${data ? data.id : f.id}` : `customField_${data ? data.id : f.id}`,
    //         definition: f,
    //         data: data ?? {
    //             id: undefined,
    //             name: f.name,
    //             datatype: f.type,
    //             definitionId: f.id,
    //             value: undefined
    //         },
    //         register: register
    //     } as CustomFieldTemplateProps;
    // }


    return (
        <div style={{width: '100%'}}>
            <div className="card-body">
                    <div className="content">
                        <form>
                            <div className="field w-full">
                                <label htmlFor="lastName" className="block">Title</label>
                                <Controller name="title" control={control} render={({field}) => (
                                    <Dropdown id={field.name} value={field.value}
                                              onChange={(e) => field.onChange(e.value)}
                                              options={ContactTitleEnum}
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

                            {router.query.id !== 'new' && (
                                <div className="field w-full">
                                    <label className="block">Tags</label>
                                    <ContactTags />
                                </div>
                            )}

                            <div className="field w-full">
                                <label htmlFor="label" className="block">Label</label>
                                <InputText id="label" {...register("label")} className="w-full"/>
                            </div>

                            {
                                contactId === 'new' && entityDefinitionTemplateData.fields && entityDefinitionTemplateData.fields.length > 0 &&
                                <EntityDefinitionEditTemplate fields={entityDefinitionTemplateData.fields} register={register}/>
                            }

                        </form>

                        <div className="flex justify-content-end">
                            <Button onClick={(e: any) => setEditDetails(false)} className='p-button-link text-gray-600'> Cancel</Button>
                            <Button onClick={() => onSubmit()} mode="primary">Save</Button>
                        </div>
                    </div>

            </div>
        </div>
    );
}

ContactDetailsSection.propTypes = {
    contactId: PropTypes.string || undefined
}
