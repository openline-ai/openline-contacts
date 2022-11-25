import PropTypes, {string} from "prop-types";
import {useEffect, useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {useForm} from "react-hook-form";
import {CustomFieldViewTemplateProps, EntityDefinitionEditTemplate, EntityDefinitionTemplateProps, EntityDefinitionViewTemplate, FieldSetViewTemplateProps} from "../generic/entityExtensionTemplates";
import {CustomField, EntityDefinition, FieldSet} from "../../models/customFields";
import {GetContactCustomFields} from "../../services/contactService";

function ContactExtensionSection(props: any) {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const [fields, setFields] = useState([] as ((CustomField | FieldSet)[]));
    const [fieldsView, setFieldsView] = useState([] as ((CustomFieldViewTemplateProps | FieldSetViewTemplateProps)[]));

    const [entityDefinition, setEntityDefinition] = useState({} as EntityDefinition);
    const [entityDefinitionTemplateData, setEntityDefinitionTemplateData] = useState({} as EntityDefinitionTemplateProps);

    const [editDetails, setEditDetails] = useState(props.initialEditState ?? false);
    const {register, setValue, handleSubmit, control} = useForm();

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

            GetContactCustomFields(client, props.contactId).then((response: (CustomField | FieldSet)[]) => {
                setFields(response);
                setFieldsView(response
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
            });

        }

    }, [props.contactId]);

    const onSubmit = handleSubmit(data => {

        console.log(data);

        let query = gql``;

        client.request(query, {}).then((response) => {
                setEditDetails(false);
            }
        ).catch((reason) => {
            console.log(reason);
            if (reason.response.status === 400) {
                // reason.response.data.errors.forEach((error: any) => {
                //     formik.setFieldError(error.field, error.message);
                // })
                //todo show errors on form
            } else {
                alert('error');
            }
        });

    });

    return <>
        <div className='card-fieldset mt-3' style={{width: '25rem'}}>
            <div className="card-header">
                <div className="flex flex-row w-full">
                    <div className="flex-grow-1">Custom fields</div>
                    <div className="flex">

                        {
                            !editDetails &&
                            <Button className="p-button-text p-0" onClick={() => {
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
                        <form>

                            <div className="grid grid-nogutter">
                                <EntityDefinitionEditTemplate
                                    name={entityDefinitionTemplateData.name}
                                    fields={entityDefinitionTemplateData.fields}
                                    register={register}
                                />
                            </div>

                        </form>

                        <div className="flex justify-content-end">
                            <Button onClick={(e: any) => setEditDetails(e.value)} className='p-button-link text-gray-600' label="Cancel"/>
                            <Button onClick={() => onSubmit()} label="Save"/>
                        </div>
                    </div>
                }

            </div>
        </div>

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