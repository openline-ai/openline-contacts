import PropTypes, {string} from "prop-types";
import {useEffect, useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {useForm} from "react-hook-form";
import {CustomFieldTemplateProps, EntityDefinitionTemplate, EntityDefinitionTemplateProps, FieldSetTemplateProps} from "../generic/entityExtensionTemplates";
import {CustomField, CustomFieldDefinition, EntityDefinition, FieldSetDefinition} from "../../models/customFields";
import {uuidv4} from "../../utils/uuid-generator";
import {GetEntityDefinitions} from "../../services/entityDefinitionService";
import {GetContactCustomFields} from "../../services/contactService";
import {Contact} from "../../models/contact";

function ContactExtension(props: any) {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

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

            const customFieldDefinitionToTemplateProps = (f: CustomFieldDefinition, fieldSetName: string | undefined = undefined, data: CustomField | undefined = undefined): CustomFieldTemplateProps => {
                return {
                    // key: uuidv4(),
                    // definition: f,
                    // data: data ?? {
                    //     key: uuidv4(),
                    //     name: f.name,
                    //     datatype: f.type,
                    //     definitionId: f.id,
                    //     value: undefined
                    // },
                    // register: register
                } as CustomFieldTemplateProps;
            }

            GetEntityDefinitions(client, "CONTACT").then((ed: EntityDefinition[]) => {
                //todo show that we have multiple types
                setEntityDefinition(ed[0]);

                const obj = {} as EntityDefinitionTemplateProps;
                obj.name = ed[0].name;
                obj.register = register;
                obj.fields = ed[0].fields.map((f: (CustomFieldDefinition | FieldSetDefinition)) => {
                    if ((f as CustomFieldDefinition).type) {
                        return customFieldDefinitionToTemplateProps(f as CustomFieldDefinition);
                    } else {
                        const fieldSet = f as FieldSetDefinition;
                        return {
                            // key: uuidv4(),
                            // name: fieldSet.name,
                            // customFields: fieldSet.customFields.map((f: CustomFieldDefinition) => customFieldDefinitionToTemplateProps(f as CustomFieldDefinition)),
                            // register: register
                        } as FieldSetTemplateProps;
                    }
                });

                setEntityDefinitionTemplateData(obj);
            });

            GetContactCustomFields(client, props.contactId).then((response: Contact) => {
                let customFields = response.customFields;
                let fieldSets = response.fieldSets;
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

                        <div>custom fields salvate manual</div>
                        <div>custom fields salvate prin definitie</div>

                    </div>
                }

                {
                    editDetails &&
                    <div className="content">
                        <form>

                            <div className="grid grid-nogutter">
                                <EntityDefinitionTemplate
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

ContactExtension.propTypes = {
    contactId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(string)
    ]) || undefined,
    className: PropTypes.arrayOf(string)
}

export default ContactExtension