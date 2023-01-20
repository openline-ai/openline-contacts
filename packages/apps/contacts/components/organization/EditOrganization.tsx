import {useRouter} from "next/router";
import {Button} from "../atoms";
import {faEdit, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {InputText} from "primereact/inputtext";
import {useForm} from "react-hook-form";
import {Dialog} from "primereact/dialog";
import {toast} from "react-toastify";
import {Organization} from "../../models/organization";
import {CreateOrganization, DeleteOrganization, UpdateOrganization} from "../../services/organizationService";
import {useGraphQLClient} from "../../utils/graphQLClient";
import {IconButton} from "../atoms/icon-button";
import {CardHeading} from "../atoms/cardHeading";

function OrganizationEdit({organisation}: {organisation:any}) {
    const client =  useGraphQLClient();

    const [organizationDetails, setOrganizationDetails] = useState(organisation as Organization);
    const [editDetails, setEditDetails] = useState(false);

    const router = useRouter();
    const {id} = router.query;

    const [reloadDetails, setReloadDetails] = useState(false);
    useEffect(() => {

        if (id !== undefined && id === 'new') {
            setEditDetails(true);
        } else if (id !== undefined && id !== 'new') {
            setEditDetails(false);
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
        }).catch(() => {
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
            }).catch(() => {
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
            }).catch(() => {
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }
    });

    return (
            <div className="h-full">
                <div className="flex flex-column">
                    <div className="flex align-items-center  mb-3">
                            <CardHeading>Details</CardHeading>
                            <div className="flex align-content-center ml-5 " style={{marginBottom: '24px'}}>
                                {
                                    !editDetails &&(
                                        <>
                                            <div>
                                            <IconButton icon={faEdit} ariaLabel="Edit" className="text-gray-800 mr-1" onClick={() => {
                                                setValue('id', organizationDetails.id);
                                                setValue('name', organizationDetails?.name);
                                                setValue('description', organizationDetails.description);
                                                setValue('industry', organizationDetails.industry);
                                                setValue('domain', organizationDetails.domain);
                                                setValue('website', organizationDetails.website);
                                                setEditDetails(true);
                                            }}/>
                                            </div>
                                            <div>
                                                <IconButton icon={faTrashCan}  ariaLabel="Delete" onClick={() => setDeleteConfirmationModalVisible(true)} className='text-gray-800'/>
                                            </div>
                                        </>
                                    )

                                }
                            </div>
                    </div>

                        {
                            !editDetails &&
                            <div className="flex flex-column justify-content-evenly mt-2 flex-grow-1">
                                <div className="flex mr-3">
                                    <span className="mr-3 text-gray-600 font-bold">Name</span>
                                    <span className="mr-3 overflow-hidden text-overflow-ellipsis">{organizationDetails.name}</span>
                                </div>
                                <div className="flex mr-3 mt-3">
                                    <span className="mr-3 text-gray-600 font-bold">Description</span>
                                    <span
                                        className="mr-3 overflow-hidden text-overflow-ellipsis">{organizationDetails.description}</span>
                                </div>
                                <div className="flex mr-3 mt-3">
                                    <span className="mr-3 text-gray-600 font-bold">Industry</span>
                                    <span
                                        className="mr-3 overflow-hidden text-overflow-ellipsis">{organizationDetails.industry}</span>
                                </div>
                                <div className="flex mr-3 mt-3">
                                    <span className="mr-3 text-gray-600 font-bold">Domain</span>
                                    <span
                                        className="mr-3 overflow-hidden text-overflow-ellipsis">{organizationDetails.domain}</span>
                                </div>
                                <div className="flex mr-3 mt-3">
                                    <span className="mr-3 text-gray-600 font-bold">Website</span>
                                    <span
                                        className="mr-3 overflow-hidden text-overflow-ellipsis">{organizationDetails.website}</span>
                                </div>
                            </div>
                        }

                        {
                            editDetails &&
                            <div className="content">
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
                                            className='p-button-link text-gray-600 mr-2'
                                    >
                                        Cancel
                                    </Button>
                                    <Button mode="primary" onClick={() => onSubmit()}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        }

                </div>

                {
                    !editDetails &&
                    <>
                        <Dialog header="Organization delete confirmation"
                                draggable={false}
                                visible={deleteConfirmationModalVisible}
                                footer={
                                    <div className="flex flex-grow-1 justify-content-between align-items-center">
                                        <Button
                                                mode="danger"
                                                onClick={() => deleteOrganization()}
                                        >
                                            Delete the organization
                                        </Button>
                                        <Button
                                            onClick={() => setDeleteConfirmationModalVisible(false)}
                                            className="p-button-text"

                                        >Cancel</Button>
                                    </div>
                                }
                                onHide={() => setDeleteConfirmationModalVisible(false)}>
                            <p>Please confirm that you want to delete this organization.</p>
                            <p>The contacts will not be changed, but the associations to this organization will be removed.</p>
                        </Dialog>
                    </>
                }
            </div>

    );
}

export default OrganizationEdit