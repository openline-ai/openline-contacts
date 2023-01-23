import {useRouter} from "next/router";
import {GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronCircleLeft, faEdit, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {InputText} from "primereact/inputtext";
import {useForm} from "react-hook-form";
import {BreadCrumb} from "primereact/breadcrumb";
import {Dialog} from "primereact/dialog";
import {DeleteContactGroup} from "../../services/contactGroupService";
import {toast} from "react-toastify";
import {Organization} from "../../models/organization";
import {CreateOrganization, DeleteOrganization, GetOrganization, UpdateOrganization} from "../../services/organizationService";
import {FullScreenModeLayout} from "../../components/organisms/fullscreen-mode-layout";
import {useGraphQLClient} from "../../utils/graphQLClient";

function OrganizationEdit() {
    const client =  useGraphQLClient();

    const [organization, setOrganization] = useState({
        id: undefined,
        name: '',
        description: '',
        industry: '',
        domain: '',
        website: ''
    } as Organization);
    const [editDetails, setEditDetails] = useState(false);

    const router = useRouter();
    const {id} = router.query;

    const [reloadDetails, setReloadDetails] = useState(false);
    useEffect(() => {

        if (id !== undefined && id === 'new') {
            setEditDetails(true);
        } else if (id !== undefined && id !== 'new') {
            setEditDetails(false);
            GetOrganization(client, id as string).then((org: Organization) => {
                setOrganization(org);
            }).catch((reason: any) => {
                //todo log error on server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }

    }, [id, reloadDetails]);

    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
    const deleteOrganization = () => {
        DeleteOrganization(client, id).then((result: boolean) => {
            if (result) {
                router.push('/organization');
                toast.success("Organization removed successfully!");
            } else {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            }
        }).catch((reason: any) => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }

    const {register, handleSubmit, setValue} = useForm();

    const onSubmit = handleSubmit(data => {

        if (!data.id) {
            CreateOrganization(client, data).then((result: Organization) => {
                if (result) {
                    router.push(`/organization/${result.id}`);
                    toast.success("Organization added successfully!");
                } else {
                    //todo log an error in server side
                    toast.error("There was a problem on our side and we are doing our best to solve it!");
                }
            }).catch((reason: any) => {
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        } else {
            UpdateOrganization(client, data).then((result: Organization) => {
                if (result) {
                    setReloadDetails(!reloadDetails);
                    toast.success("Organization updated successfully!");
                } else {
                    //todo log an error in server side
                    toast.error("There was a problem on our side and we are doing our best to solve it!");
                }
            }).catch((reason: any) => {
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }
    });

    const items = [
        {label: 'Organizations', url: '/organization'}
    ];
    const home = {icon: 'pi pi-home', url: '/'}

    return (
        <FullScreenModeLayout fullScreenMode>

            <div className="flex flex-column p-5">
                <div className="flex" >
                    <div className="card-fieldset" style={{width: '25rem'}}>
                        <div className="card-header">
                            <div className="flex flex-row w-full">
                                <div className="flex-grow-1">Organization details</div>
                                <div className="flex">
                                    {
                                        !editDetails &&
                                        <Button className="p-button-text p-0" onClick={() => {
                                            console.log(organization)
                                            setValue('id', organization.id);
                                            setValue('name', organization.name);
                                            setValue('description', organization.description);
                                            setValue('industry', organization.industry);
                                            setValue('domain', organization.domain);
                                            setValue('website', organization.website);
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
                                        <div className="col-4">Name</div>
                                        <div className="col-8 overflow-hidden text-overflow-ellipsis">{organization.name}</div>
                                    </div>
                                    <div className="grid grid-nogutter mt-3">
                                        <div className="col-4">Description</div>
                                        <div
                                            className="col-8 overflow-hidden text-overflow-ellipsis">{organization.description}</div>
                                    </div>
                                    <div className="grid grid-nogutter mt-3">
                                        <div className="col-4">Industry</div>
                                        <div
                                            className="col-8 overflow-hidden text-overflow-ellipsis">{organization.industry}</div>
                                    </div>
                                    <div className="grid grid-nogutter mt-3">
                                        <div className="col-4">Domain</div>
                                        <div
                                            className="col-8 overflow-hidden text-overflow-ellipsis">{organization.domain}</div>
                                    </div>
                                    <div className="grid grid-nogutter mt-3">
                                        <div className="col-4">Website</div>
                                        <div
                                            className="col-8 overflow-hidden text-overflow-ellipsis">{organization.website}</div>
                                    </div>
                                </div>
                            }

                            {
                                editDetails &&
                                <div className="content" style={{width: '25rem'}}>
                                    <form onSubmit={onSubmit}>
                                        <div className="field w-full">
                                            <label htmlFor="name" className="block">Name *</label>
                                            <InputText id="name" autoFocus {...register("name")} className="w-full"/>
                                        </div>
                                        <div className="field w-full">
                                            <label htmlFor="description" className="block">Description</label>
                                            <InputText id="description"  {...register("description")} className="w-full"/>
                                        </div>
                                        <div className="field w-full">
                                            <label htmlFor="industry" className="block">Industry</label>
                                            <InputText id="industry"  {...register("industry")} className="w-full"/>
                                        </div>
                                        <div className="field w-full">
                                            <label htmlFor="domain" className="block">Domain</label>
                                            <InputText id="domain"  {...register("domain")} className="w-full"/>
                                        </div>
                                        <div className="field w-full">
                                            <label htmlFor="website" className="block">Website</label>
                                            <InputText id="website"  {...register("website")} className="w-full"/>
                                        </div>
                                    </form>

                                    <div className="flex justify-content-end">
                                        <Button onClick={(e: any) => setEditDetails(e.value)}
                                                className='p-button-link text-gray-600'
                                                label="Cancel"/>
                                        <Button onClick={() => onSubmit()} label="Save"/>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                </div>

                {
                        !editDetails &&
                        <div className='flex'>
                            <div className="flex align-items-center mt-2 ml-1">
                                <FontAwesomeIcon icon={faTrashCan} className="text-gray-600" style={{color: 'black'}}/>
                                <Button onClick={(e: any) => setDeleteConfirmationModalVisible(true)} className='p-button-link text-gray-600'
                                        label="Delete"/>
                            </div>
                            <Dialog header="Organization delete confirmation"
                                    draggable={false}
                                    visible={deleteConfirmationModalVisible}
                                    footer={
                                        <div className="flex flex-grow-1 justify-content-between align-items-center">
                                            <Button label="Delete the organization" icon="pi pi-check" onClick={() => deleteOrganization()}/>
                                            <Button label="Cancel" icon="pi pi-times" onClick={() => setDeleteConfirmationModalVisible(false)} className="p-button-text"/>
                                        </div>
                                    }
                                    onHide={() => setDeleteConfirmationModalVisible(false)}>
                                <p>Please confirm that you want to delete this organization.</p>
                                <p>The contacts will not be changed, but the associations to this organization will be removed.</p>
                            </Dialog>
                        </div>
                    }


            </div>

        </FullScreenModeLayout>
    );
}

export default OrganizationEdit