import {Controller, useForm} from "react-hook-form";
import PropTypes from "prop-types";
import React, {useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {Button} from "../atoms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBriefcase, faEdit, faTrashCan, faUserNinja} from "@fortawesome/free-solid-svg-icons";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import SearchOrAddComponent from "../generic/SearchOrAddComponent";
import {toast} from "react-toastify";
import {GetOrganizations} from "../../services/organizationService";
import {PaginatedRequest, PaginatedResponse} from "../../utils/pagination";
import {GetContactTypes} from "../../services/contactTags";
import {ContactTag} from "../../models/contact";
import {Organization} from "../../models/organization";
import {useGraphQLClient} from "../../utils/graphQLClient";
import {DeleteConfirmationDialog} from "../atoms";

function ContactOrganizationTemplate(props: any) {
    const client =  useGraphQLClient();

    const {register, setValue, handleSubmit, control} = useForm({
        defaultValues: props.organizationRole
    });

    const onSubmit = handleSubmit((data: any) => {

        let query = undefined;

        if (!data.id) {
            query = gql`mutation CreateContactRole ($contactId: ID!, $contactRole: ContactRoleInput!) {
                contactRole_Create(contactId: $contactId, input: $contactRole) {
                    id
                    organization {
                        id
                        name
                    }
                    jobTitle
                }
            }`
        } else {
            query = gql`mutation UpdateContactRole ($contactId: ID!, $roleId: ID!, $contactRole: ContactRoleInput!) {
                contactRole_Update(contactId: $contactId, roleId: $roleId, input: $contactRole) {
                    id
                    organization {
                        id
                        name
                    }
                    jobTitle
                }
            }`
        }

        client.request(query, {
            contactId: props.contactId,
            roleId: data.id,
            contactRole: {
                organizationId: data.organizationId,
                jobTitle: data.jobTitle
            }
        }).then((response) => {
                if (!data.id) {
                    props.notifySave({
                        ...response.contactRole_Create, ...{
                            uiKey: data.uiKey,
                            organizationId: response.contactRole_Create.organization.id,
                            organizationName: response.contactRole_Create.organization.name
                        }
                    });
                    toast.success("Organization added successfully!");
                } else {
                    props.notifySave({
                        ...response.contactRole_Update, ...{
                            uiKey: data.uiKey,
                            organizationId: response.contactRole_Update.organization.id,
                            organizationName: response.contactRole_Update.organization.name
                        }
                    });
                    toast.success("Organization updated successfully!");
                }
                setEditDetails(false);
            }
        ).catch((reason: any) => {
            //todo log an error in server side
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    })

    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
    const deleteRole = () => {
        //todo show loading
        const query = gql`mutation DeleteOrganizationRole ($contactId: ID!, $roleId: ID!) {
            contactRole_Delete(contactId: $contactId, roleId: $roleId){
                result
            }
        }`

        client.request(query, {
            contactId: props.contactId,
            roleId: props.organizationRole.id
        }).then((response: any) => {
            if (response.contactRole_Delete.result) {
                toast.success("Organization removed successfully!");
                props.notifyDelete(props.organizationRole.uiKey);

                setDeleteConfirmationModalVisible(false);
            } else {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            }
        }).catch((reason: any) => {
            //todo log an error in server side
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }
    const notifyCancelEdit = (uiKey: string) => {
        setEditDetails(false);
        props.notifyCancelEdit(uiKey);
    }

    const [editDetails, setEditDetails] = useState(props.initialEditState ?? false);

    const searchOrganization = function (name: string, maxResults: number) {
        return new Promise((resolve, reject) => {

            const params = {
                pagination: {
                    page: 0,
                    limit: maxResults
                }
            } as PaginatedRequest;

            GetOrganizations(client, params).then((response: PaginatedResponse<Organization>) => {
                resolve({
                    content: response.content,
                    totalElements: response.totalElements
                });
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
                reject(reason);
            });

        });
    }

    return (
        <>
            {
                !editDetails &&
                <div className="display">
                    <div className="grid grid-nogutter mt-3">
                        <div className="col-8">
                            Organization: {props.organizationRole.organization.name}<br/>
                            Job: {props.organizationRole.jobTitle}
                        </div>
                        <div className="col-4">

                            <Button className="p-button-text p-0" onClick={(e: any) => {
                                setValue('id', props.organizationRole.id);
                                setValue('organizationId', props.organizationRole.organization.id);
                                setValue('organizationName', props.organizationRole.organization.name);
                                setValue('jobTitle', props.organizationRole.jobTitle);
                                setEditDetails(true);
                            }}>
                                <FontAwesomeIcon size="xs" icon={faEdit} style={{color: 'black'}}/>
                            </Button>

                            <Button className="p-button-text p-0" onClick={(e: any) => setDeleteConfirmationModalVisible(true)}>
                                <FontAwesomeIcon size="xs" icon={faTrashCan} style={{color: 'black'}}/>
                            </Button>

                            <DeleteConfirmationDialog
                                deleteConfirmationModalVisible={deleteConfirmationModalVisible}
                                setDeleteConfirmationModalVisible={setDeleteConfirmationModalVisible}
                                deleteAction={deleteRole}
                                confirmationButtonLabel="Delete role"
                            />
                        </div>
                    </div>
                </div>
            }

            {
                editDetails &&
                <div className="content">
                    <form>
                        <div className="field w-full">
                            <label htmlFor="organizationName" className="block">Organization *</label>
                            <Controller name="organizationName" control={control} render={({field}) => (
                                <SearchOrAddComponent
                                    resourceLabel="organizations"
                                    value={field.value}
                                    searchData={(name: string, maxResults: number) => {
                                        return searchOrganization(name, maxResults);
                                    }}
                                    searchItemTemplate={(e: any) => {
                                        return <>
                                            <span className="mr-3"><FontAwesomeIcon icon={faBriefcase}/></span>
                                            <span className="mr-3">{e.name}</span>
                                        </>
                                    }}
                                    onInputValueChanged={(c: any) => {
                                        setValue('organizationId', undefined);
                                        setValue('organizationName', c.label);
                                    }}
                                    onItemSelected={(e: any) => {
                                        setValue('organizationId', e.id);
                                        setValue('organizationName', e.name);
                                    }}
                                    maxResults={5}/>
                            )}/>
                        </div>
                        <div className="field w-full">
                            <label htmlFor="jobTitle" className="block">Job *</label>
                            <InputText id="jobTitle" {...register("jobTitle")} className="w-full"/>
                        </div>
                    </form>

                    <div className="flex justify-content-end">
                        <Button onClick={(e: any) => notifyCancelEdit(props.organizationRole.uiKey)} className='p-button-link text-gray-600'> Cancel</Button>
                        <Button onClick={() => onSubmit()} mode="primary">Save</Button>
                    </div>
                </div>
            }
        </>
    );
}

ContactOrganizationTemplate.propTypes = {
    contactId: PropTypes.string,
    organizationRole: PropTypes.object,
    initialEditState: PropTypes.bool,
    notifySave: PropTypes.func,
    notifyDelete: PropTypes.func,
    notifyCancelEdit: PropTypes.func
}

ContactOrganizationTemplate.defaultValues = {
    initialEditState: false,
    notifySave: () => {
    },
    notifyDelete: () => {
    },
    notifyCancelEdit: () => {
    }
}

export default ContactOrganizationTemplate