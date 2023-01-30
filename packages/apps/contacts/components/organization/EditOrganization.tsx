import {useRouter} from "next/router";
import {GraphQLClient} from "graphql-request";
import {Button, DeleteConfirmationDialog, Address} from "../atoms";
import {faEdit, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {InputText} from "primereact/inputtext";
import {useForm} from "react-hook-form";
import {Dialog} from "primereact/dialog";
import {toast} from "react-toastify";
import {Organization} from "../../models/organization";
import {CreateOrganization, DeleteOrganization, UpdateOrganization} from "../../services/organizationService";
import {useGraphQLClient} from "../../utils/graphQLClient";
import {IconButton} from "../atoms/icon-button";
import {CardHeading} from "../atoms/cardHeading";
import Link from "next/link";
import * as domain from "domain";

function OrganizationEdit({organisation, onReload, createMode}: {organisation:Organization, createMode:boolean, onReload: () =>void}) {
    const client =  useGraphQLClient();

    const [editDetails, setEditDetails] = useState(createMode);
    const router = useRouter();
    const {id} = router.query;
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
                    setEditDetails(false);
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
                    onReload()
                    setEditDetails(false);
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
                    <div className="flex align-items-center justify-content-between">
                            <CardHeading subheading={organisation?.industry}>{organisation?.name || 'Unknown'}</CardHeading>
                            <div className="flex align-content-center ml-5 " style={{marginBottom: '24px'}}>
                                {
                                    !editDetails &&(
                                        <>
                                            <div>
                                            <IconButton icon={faEdit} ariaLabel="Edit" className="text-gray-800 mr-1" onClick={() => {
                                                setValue('id', organisation?.id);
                                                setValue('name', organisation?.name);
                                                setValue('description', organisation?.description);
                                                setValue('industry', organisation?.industry);
                                                setValue('domain', organisation?.domain);
                                                setValue('website', organisation?.website);
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
                            <div className="flex flex-column justify-content-evenly flex-grow-1">
                                <div className="flex">
                                    <span
                                        className="mr-3 overflow-hidden text-overflow-ellipsis">{organisation?.description}</span>
                                </div>
                                <div className="flex mr-3 mt-3">
                                    <Link href={`https://${organisation?.website}` || `https://${organisation?.domain}` }
                                          target="_blank"
                                          className='cta'>
                                        {organisation?.domain}
                                    </Link>
                                </div>

                                <div>
                                    {organisation?.addresses?.map((data) => (
                                        <Address
                                            key={data.id}
                                            createdAt={data.createdAt}
                                            country={data.country}
                                            state={data.state}
                                            city={data.city}
                                            address={data.address}
                                            address2={data?.address2}
                                            zip={data.zip}
                                            phone={data.phone}
                                            fax={data?.fax}
                                        />
                                    ))}
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
                        <DeleteConfirmationDialog
                            deleteConfirmationModalVisible={deleteConfirmationModalVisible}
                            setDeleteConfirmationModalVisible={setDeleteConfirmationModalVisible}
                            deleteAction={deleteOrganization}
                            explanationText={(
                                <>
                                    <p>Please confirm that you want to delete this organization.</p>
                                    <p>The contacts will not be changed, but the associations to this organization will be removed.</p>
                                </>
                            )}
                        />
                    </>
                }
            </div>

    );
}

export default OrganizationEdit