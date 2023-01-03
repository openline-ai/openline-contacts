import {Controller, useForm} from "react-hook-form";
import PropTypes from "prop-types";
import {useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBriefcase, faEdit, faTrashCan, faUserNinja} from "@fortawesome/free-solid-svg-icons";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import SearchOrAddComponent from "../generic/SearchOrAddComponent";
import {toast} from "react-toastify";

function ContactCompanyPositionTemplate(props: any) {
    const client = new GraphQLClient(`/customer-os-api/query`);

    const {register, setValue, handleSubmit, control} = useForm({
        defaultValues: props.companyPosition
    });

    const onSubmit = handleSubmit((data: any) => {

        let query = undefined;

        if (!data.id) {
            query = gql`mutation MergeCompanyPosition ($contactId: ID!, $companyPosition: CompanyPositionInput!) {
                contact_MergeCompanyPosition(contactId: $contactId, input: $companyPosition){
                    id
                    role{
                        id
                        name
                    }
                    jobTitle
                }
            }`
        } else {
            query = gql`mutation UpdateCompanyPosition ($contactId: ID!, $companyPositionId: ID!, $companyPosition: CompanyPositionInput!) {
                contact_UpdateCompanyPosition(contactId: $contactId, companyPositionId: $companyPositionId input: $companyPosition){
                    id
                    role{
                        id
                        name
                    }
                    jobTitle
                }
            }`
        }

        client.request(query, {
            contactId: props.contactId,
            companyPositionId: data.id,
            companyPosition: {
                company: {
                    id: data.companyId,
                    name: data.companyName
                },
                jobTitle: data.jobTitle
            }
        }).then((response) => {
                if (!data.id) {
                    props.notifySave({
                        ...response.contact_MergeCompanyPosition, ...{
                            uiKey: data.uiKey,
                            companyId: response.contact_MergeCompanyPosition.company.id,
                            companyName: response.contact_MergeCompanyPosition.company.name
                        }
                    });
                    toast.success("Company position added successfully!");
                } else {
                    props.notifySave({
                        ...response.contact_UpdateCompanyPosition, ...{
                            uiKey: data.uiKey,
                            companyId: response.contact_UpdateCompanyPosition.company.id,
                            companyName: response.contact_UpdateCompanyPosition.company.name
                        }
                    });
                    toast.success("Company position updated successfully!");
                }
                setEditDetails(false);
            }
        ).catch((reason: any) => {
            //todo log an error in server side
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    })

    const [deleteCompanyPositionConfirmationModalVisible, setDeleteCompanyPositionConfirmationModalVisible] = useState(false);
    const deleteCompanyPosition = () => {
        //todo show loading
        const query = gql`mutation DeleteCompanyPosition ($contactId: ID!, $companyPositionId: ID!) {
            contact_DeleteCompanyPosition(contactId: $contactId, companyPositionId: $companyPositionId){
                result
            }
        }`

        client.request(query, {
            contactId: props.contactId,
            companyPositionId: props.companyPosition.id
        }).then((response: any) => {
            if (response.contact_DeleteCompanyPosition.result) {
                toast.success("Company position removed successfully!");
                props.notifyDelete(props.companyPosition.uiKey);

                setDeleteCompanyPositionConfirmationModalVisible(false);
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

    const searchCompany = function (name: string, maxResults: string) {
        return new Promise((resolve, reject) => {

            const query = gql`query SearchCompanyByName ($pagination: Pagination!, $name: String!) {
                companies_ByNameLike(pagination: $pagination, companyName: $name){
                    content{
                        id
                        name
                    }
                    totalElements
                }
            }`

            client.request(query, {
                pagination: {
                    "page": 0,
                    "limit": maxResults
                },
                name: name
            }).then((response: any) => {
                if (response.companies_ByNameLike.content) {
                    resolve({
                        content: response.companies_ByNameLike.content,
                        totalElements: response.companies_ByNameLike.totalElements
                    });
                } else {
                    resolve({
                        error: response
                    });
                }
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
                            Company: {props.companyPosition.companyName}<br/>
                            Job: {props.companyPosition.jobTitle}
                        </div>
                        <div className="col-4">

                            <Button className="p-button-text p-0" onClick={(e: any) => {
                                setValue('id', props.companyPosition.id);
                                setValue('companyId', props.companyPosition.companyId);
                                setValue('companyName', props.companyPosition.companyName);
                                setValue('jobTitle', props.companyPosition.jobTitle);
                                setEditDetails(true);
                            }}>
                                <FontAwesomeIcon size="xs" icon={faEdit} style={{color: 'black'}}/>
                            </Button>

                            <Button className="p-button-text p-0" onClick={(e: any) => setDeleteCompanyPositionConfirmationModalVisible(true)}>
                                <FontAwesomeIcon size="xs" icon={faTrashCan} style={{color: 'black'}}/>
                            </Button>
                            <Dialog header="Company position delete confirmation"
                                    draggable={false}
                                    visible={deleteCompanyPositionConfirmationModalVisible}
                                    footer={
                                        <div className="flex flex-grow-1 justify-content-between align-items-center">
                                            <Button label="Delete the company position" icon="pi pi-check" onClick={() => deleteCompanyPosition()} autoFocus/>
                                            <Button label="Cancel" icon="pi pi-times" onClick={() => setDeleteCompanyPositionConfirmationModalVisible(false)} className="p-button-text"/>
                                        </div>
                                    }
                                    onHide={() => setDeleteCompanyPositionConfirmationModalVisible(false)}>
                                <p>Please confirm that you want to delete this company position.</p>
                            </Dialog>

                        </div>
                    </div>
                </div>
            }

            {
                editDetails &&
                <div className="content">
                    <form>
                        <div className="field w-full">
                            <label htmlFor="companyName" className="block">Company *</label>
                            <Controller name="companyName" control={control} render={({field}) => (
                                <SearchOrAddComponent
                                    resourceLabel="companies"
                                    value={field.value}
                                    searchData={(name: string, maxResults: string) => {
                                        return searchCompany(name, maxResults);
                                    }}
                                    searchItemTemplate={(e: any) => {
                                        return <>
                                            <span className="mr-3"><FontAwesomeIcon icon={faBriefcase}/></span>
                                            <span className="mr-3">{e.name}</span>
                                        </>
                                    }}
                                    onInputValueChanged={(c: any) => {
                                        setValue('companyId', undefined);
                                        setValue('companyName', c.label);
                                    }}
                                    onItemSelected={(e: any) => {
                                        setValue('companyId', e.id);
                                        setValue('companyName', e.name);
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
                        <Button onClick={(e: any) => notifyCancelEdit(props.companyPosition.uiKey)} className='p-button-link text-gray-600' label="Cancel"/>
                        <Button onClick={() => onSubmit()} label="Save"/>
                    </div>
                </div>
            }
        </>
    );
}

ContactCompanyPositionTemplate.propTypes = {
    contactId: PropTypes.string,
    companyPosition: PropTypes.object,
    initialEditState: PropTypes.bool,
    notifySave: PropTypes.func,
    notifyDelete: PropTypes.func,
    notifyCancelEdit: PropTypes.func
}

ContactCompanyPositionTemplate.defaultValues = {
    initialEditState: false,
    notifySave: () => {
    },
    notifyDelete: () => {
    },
    notifyCancelEdit: () => {
    }
}

export default ContactCompanyPositionTemplate