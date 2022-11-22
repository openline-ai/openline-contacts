import PropTypes, {string} from "prop-types";
import {useEffect, useImperativeHandle, useRef, useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faEdit, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {OverlayPanel} from "primereact/overlaypanel";
import {Menu} from "primereact/menu";
import ContactEmailTemplate from "./contactEmailTemplate";
import {uuidv4} from "../../utils/uuid-generator";
import ContactPhoneNumberTemplate from "./contactPhoneNumberTemplate";
import {Dialog} from "primereact/dialog";
import {useForm} from "react-hook-form";
import {getEnumLabel} from "../../model/enums";
import {ContactTitleEnum} from "../../model/enum-contactTitle";
import {InputText} from "primereact/inputtext";

function ContactExtension(props: any) {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const [contactExtensionDefinition, setContactExtensionDefinition] = useState({} as any);
    const [contactExtensionData, setContactExtensionData] = useState({} as any);

    const [editDetails, setEditDetails] = useState(props.initialEditState ?? false);
    const {register, setValue, handleSubmit, control} = useForm({
        defaultValues: contactExtensionData
    });

    useEffect(() => {
        if (props.contactId !== undefined) {
            const contactExtensionQuery = gql`query GetContactExtension {
                entityDefinitions(extends: CONTACT) {
                    id
                    name
                    fieldSets {
                        id
                        name
                        order
                        customFields {
                            id
                            name
                            type
                            order
                            mandatory
                            length
                            min
                            max
                        }
                    }
                    customFields {
                        id
                        name
                        type
                        order
                        mandatory
                        length
                        min
                        max
                    }
                }
            }`

            client.request(contactExtensionQuery).then((response: any) => {
                if (!response.entityDefinitions || response.entityDefinitions.length != 1) {
                    //todo show something to inform that we have multiple definitions
                } else {
                    var sortedData = [] as any;
                    response.entityDefinitions[0].customFields.forEach((f: any) => sortedData.push(f));
                    response.entityDefinitions[0].fieldSets.forEach((f: any) => sortedData.push(f));

                    sortedData = sortedData.sort(function (a, b) {
                        return a.order - b.order;
                    });

                    console.log(sortedData);

                    setContactExtensionDefinition({
                        id: response.entityDefinitions[0].id,
                        fields: sortedData
                    });
                }
            });

            // const contactExtensionDataQuery = gql`query GetContactExtensionData($id: ID!) {
            //     contact(id: $id) {
            //         customFields {
            //             id
            //             name
            //             datatype
            //             value
            //             definition {
            //                 id
            //                 name
            //                 type
            //                 order
            //                 mandatory
            //                 length
            //                 min
            //                 max
            //             }
            //         }
            //         fieldSets {
            //             id
            //             name
            //             definition {
            //                 id
            //                 name
            //                 order
            //             }
            //             customFields {
            //                 id
            //                 name
            //                 datatype
            //                 value
            //                 definition {
            //                     id
            //                     name
            //                     type
            //                     order
            //                     mandatory
            //                     length
            //                     min
            //                     max
            //                 }
            //             }
            //         }
            //     }
            // }`

            // client.request(contactExtensionDataQuery).then((response: any) => {
            // var data = [];
            // data.push(response.contact.customFields);
            // data.push(response.contact.fieldSets);
            //
            // data = data.sort(function(a, b) {
            //     return a.order - b.order;
            // });
            //
            // console.log(data);
            // setContactExtensionData(response.contact);
            // });
        }

    }, [props.contactId]);

    const onSubmit = handleSubmit(data => {

        console.log(data);

        let query = gql``;

        client.request(query, {

        }).then((response) => {
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

    const fieldsetTemplate = (field: any) => {
        return <div className="field w-full">
            <div className="mb-3">{field.name}</div>
            <div className="pl-3">
                {
                    field.customFields.map((c: any) => {
                        return fieldTemplate(c);
                    })
                }
            </div>
        </div>
    }

    const fieldTemplate = (field: any) => {
        return <div className="field w-full">
            <label htmlFor={field.id} className="block">{field.name} {field.mandatory ? '*' : ''}</label>
            <InputText id={field.id} {...register(field.id)} className="w-full"/>
        </div>
    }

    return <>

        {
            !contactExtensionDefinition.id &&
            ''
        }

        {
            contactExtensionDefinition.id &&
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

                            {
                                contactExtensionData.id &&
                                <div className="grid grid-nogutter">
                                   afiseaza fieldurile salvate
                                </div>
                            }

                            {
                                !contactExtensionData.id &&
                                <div>No fields defined</div>
                            }

                        </div>
                    }

                    {
                        editDetails &&
                        <div className="content">
                            <form>

                                {/*if I have data saved in customer, I show it*/}
                                {
                                    contactExtensionData.id &&
                                    <div className="grid grid-nogutter">
                                        {
                                            contactExtensionData.fields.map((field: any) => {
                                                return <div>abc</div>
                                            })
                                        }
                                    </div>
                                }

                                {/*if I DON'T have data saved in customer, i show the latest definition*/}
                                {
                                    !contactExtensionData.id &&
                                    <div className="grid grid-nogutter">
                                        {
                                            contactExtensionDefinition.fields.map((field: any) => {
                                                if (field.customFields) {
                                                    return fieldsetTemplate(field);
                                                } else {
                                                    return fieldTemplate(field);
                                                }
                                            })
                                        }
                                    </div>
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
        }

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