import PropTypes, {string} from "prop-types";
import {useEffect, useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {useForm} from "react-hook-form";
import {
    CustomFieldTemplateProps,
    CustomFieldViewTemplateProps,
    EntityDefinitionEditTemplate,
    EntityDefinitionTemplateProps,
    EntityDefinitionViewTemplate,
    FieldSetTemplateProps,
    FieldSetViewTemplateProps,
    mapEntityExtensionDataFromFormData
} from "../generic/entityExtensionTemplates";
import {CustomField, FieldSet} from "../../models/customFields";
import {GetContactCustomFields} from "../../services/contactService";
import {Contact} from "../../models/contact";
import {toast} from "react-toastify";

function ContactExtensionSection(props: any) {
    const client = new GraphQLClient(`/customer-os-api/query`);

    const [reloadCustomFields, setReloadCustomFields] = useState(false);
    const [definitionId, setDefinitionId] = useState('');
    const [fields, setFields] = useState([] as ((CustomField | FieldSet)[]));
    const [fieldsView, setFieldsView] = useState([] as ((CustomFieldViewTemplateProps | FieldSetViewTemplateProps)[]));
    const [fieldsEdit, setFieldsEdit] = useState([] as ((CustomFieldTemplateProps | FieldSetTemplateProps)[]));
    const [entityDefinitionTemplateData, setEntityDefinitionTemplateData] = useState({} as EntityDefinitionTemplateProps);

    const [editDetails, setEditDetails] = useState(props.initialEditState ?? false);

    /**
     * New contact
     * after you select the contact type, you load the custom fields definition for that contact type and show the fields
     *
     * View contact
     * when you view a contact, you load the custom fields for a contact. if the fields have values, you show them, otherwise, you don't
     *
     * Editing a custom field
     * edit a field -> if it's from a definition -> you edit the whole definition
     * edit a field -> created manually -> edit just that field
     *
     * WARNING
     * when there are no fields saved with a value, but we have the underlying fields saved, not sure how to put the edit button
     */


    useEffect(() => {
        if (!client) return;

        if (props.contactId) {

            const mapCustomFieldToCustomFieldViewTemplateProps = (c: CustomField) => {
                return {
                    id: c.id,
                    label: c.name,
                    value: c.value
                } as CustomFieldViewTemplateProps
            }

            const mapCustomFieldToCustomFieldTemplateProps = (c: CustomField, fieldSetId: string | undefined = undefined, register: any) => {
                return {
                    id: fieldSetId ? `fieldSet_${fieldSetId}_customField_${c.id}` : `customField_${c.id}`,
                    data: c,
                    definition: c.definition,
                    register: register
                } as CustomFieldTemplateProps
            }

            GetContactCustomFields(client, props.contactId).then((response: Contact) => {
                setDefinitionId(response.definition?.id);
                setFields(response.sortedFieldsAndFieldSets);
                setFieldsView(response.sortedFieldsAndFieldSets
                    .filter((c: CustomField | FieldSet) => {
                        if ((c as CustomField).datatype) {
                            let customField = c as CustomField;
                            if (customField.value) {
                                return c;
                            }
                        } else {
                            let fieldSet = c as FieldSet;
                            fieldSet.customFields = fieldSet.customFields.filter((f: CustomField) => f.value && f.value !== '');
                            if (fieldSet.customFields.length > 0) {
                                return fieldSet;
                            }
                        }
                    })
                    .map((c: CustomField | FieldSet) => {
                        if ((c as CustomField).datatype) {
                            return mapCustomFieldToCustomFieldViewTemplateProps(c as CustomField);
                        } else {
                            let fieldSet = c as FieldSet;
                            return {
                                id: c.id,
                                label: c.name,
                                fields: fieldSet.customFields.map((f: CustomField) => mapCustomFieldToCustomFieldViewTemplateProps(f))
                            }
                        }
                    }));

                let fieldsToEdit = response.sortedFieldsAndFieldSets
                    .map((c: CustomField | FieldSet) => {
                        if ((c as CustomField).datatype) {
                            return mapCustomFieldToCustomFieldTemplateProps(c as CustomField, undefined, register);
                        } else {
                            let fieldSet = c as FieldSet;
                            return {
                                id: `fieldSet_${c.id}`,
                                name: c.name,
                                definition: c.definition,
                                definitionId: c.definitionId,
                                customFields: fieldSet.customFields.map((f: CustomField) => mapCustomFieldToCustomFieldTemplateProps(f as CustomField, fieldSet.id, register)),
                                register: register
                            } as FieldSetTemplateProps;
                        }
                    });
                setFieldsEdit(fieldsToEdit);

                const obj = {} as EntityDefinitionTemplateProps;
                obj.register = register;
                obj.fields = fieldsToEdit;
                setEntityDefinitionTemplateData(obj);
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }

    }, [props.contactId, reloadCustomFields]);

    const {register, handleSubmit, setValue} = useForm();

    const onSubmit = handleSubmit(data => {
        let entityExtension = mapEntityExtensionDataFromFormData(data, entityDefinitionTemplateData);

        data.customFields = entityExtension.customFields;
        data.fieldSets = entityExtension.fieldSets;

        const query = gql`mutation UpdateCustomFields($contactId: ID!, $customFields: [CustomFieldInput!], $fieldSets: [FieldSetInput!]) {
            customFieldsMergeAndUpdateInContact(contactId: $contactId, customFields: $customFields, fieldSets: $fieldSets) {
                id
            }
        }`

        client.request(query, {
            contactId: props.contactId,
            customFields: entityExtension.customFields,
            fieldSets: entityExtension.fieldSets
        }).then((response: any) => {
            if (response.customFieldsMergeAndUpdateInContact) {
                toast.success("Custom fields updated successfully!");
                setReloadCustomFields(true);
                setEditDetails(false);
            } else {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            }
        }).catch((reason: any) => {
            //todo log an error in server side
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    });

    return <>
        {
            definitionId &&
            <div className='card-fieldset mt-3' style={{width: '25rem'}}>
                <div className="card-header">
                    <div className="flex flex-row w-full">
                        <div className="flex-grow-1">Custom fields</div>
                        <div className="flex">

                            {
                                definitionId && !editDetails &&
                                <Button className="p-button-text p-0" onClick={() => {
                                    fieldsEdit.forEach((f: CustomFieldTemplateProps | FieldSetTemplateProps) => {
                                        if ((f as CustomFieldTemplateProps).data) {
                                            setValue(f.id, (f as CustomFieldTemplateProps).data.value);
                                        } else {
                                            (f as FieldSetTemplateProps).customFields.forEach((fcf: CustomFieldTemplateProps) => {
                                                setValue(fcf.id, fcf.data.value);
                                            });
                                        }
                                    });
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
                            <EntityDefinitionViewTemplate fields={fieldsView}/>
                        </div>
                    }

                    {
                        editDetails &&
                        <div className="content">
                            <EntityDefinitionEditTemplate fields={fieldsEdit} register={register}/>

                            <div className="flex justify-content-end">
                                <Button onClick={(e: any) => setEditDetails(e.value)} className='p-button-link text-gray-600' label="Cancel"/>
                                <Button onClick={() => onSubmit()} label="Save"/>
                            </div>
                        </div>
                    }

                </div>
            </div>
        }

    </>
}

ContactExtensionSection.propTypes = {
    contactId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(string)
    ]) || undefined,
    className: PropTypes.arrayOf(string)
}

export default ContactExtensionSection