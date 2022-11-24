import {useRouter} from "next/router";
import {GraphQLClient} from "graphql-request";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faUserNinja} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {Controller, useForm} from "react-hook-form";
import {getEnumLabel} from "../../model/enums";
import {ContactTitleEnum} from "../../model/enum-contactTitle";
import {InputTextarea} from "primereact/inputtextarea";
import SearchComponent from "../../components/generic/SearchComponent";
import {CreateContact, GetContactDetails, UpdateContact} from "../../services/contactService";
import {Contact, ContactType} from "../../models/contact";
import {GetContactTypes} from "../../services/contactTypeService";
import {GetUsersPage} from "../../services/userService";
import {Page, PaginationOf} from "../../models/pagination";
import {User} from "../../models/user";
import PropTypes, {string} from "prop-types";

export default function ContactDetailsSection(props: any) {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const router = useRouter();

    const [reloadContactDetails, setReloadContactDetails] = useState(false);
    const [contact, setContact] = useState({
        title: '',
        firstName: '',
        lastName: '',
        ownerId: undefined,
        ownerFullName: '',
        contactTypeId: undefined,
        contactTypeName: '',
        label: '',
        notes: ''
    }) as any;

    const {register, handleSubmit, setValue, control} = useForm({
        defaultValues: contact
    });

    const [contactTypeList, setContactTypeList] = useState([] as any);
    const [editDetails, setEditDetails] = useState(false);

    useEffect(() => {
        if (props.contactId) {
            setEditDetails(false);

            GetContactTypes(client).then((contactTypes: ContactType[]) => {
                setContactTypeList(contactTypes);
            }).catch((reason: any) => {
                // TODO throw error
                console.log(reason);
            });
        }

        if (props.contactId && props.contactId === 'new') {
            setEditDetails(true);
        } else if (props.contactId && props.contactId !== 'new') {
            GetContactDetails(client, props.contactId).then((contact: Contact) => {
                setContact(getContactObjectFromResponse(contact));
            }).catch((reason: any) => {
                // TODO throw error
                console.log(reason);
            });
        }

    }, [props.contactId, reloadContactDetails]);

    const getContactObjectFromResponse = (contact: Contact) => {
        return {
            id: contact.id,
            title: contact.title,
            firstName: contact.firstName,
            lastName: contact.lastName,
            ownerId: contact.owner?.id ?? undefined,
            ownerFullName: contact.owner ? contact.owner.firstName + ' ' + contact.owner.lastName : '',
            contactTypeId: contact.contactType?.id ?? undefined,
            contactTypeName: contact.contactType?.name ?? '',
            label: contact.label,
            notes: contact.notes
        };
    }

    const onSubmit = handleSubmit(data => {
        if (!data.id) {
            CreateContact(client, data).then((savedContact: Contact) => {
                router.push('/contact/' + savedContact.id);
            }).catch((reason: any) => {
                // TODO throw error
                console.log(reason);
            });
        } else {
            UpdateContact(client, data).then((savedContact: Contact) => {
                setReloadContactDetails(!reloadContactDetails);
            }).catch((reason: any) => {
                // TODO throw error
                console.log(reason);
            });
        }
    });

    const searchOwner = function (where: any, maxResults: string) {
        return new Promise((resolve, reject) => {
            GetUsersPage(client, PaginationOf(), where).then((response: Page<User>) => {
                resolve(response);
            }).catch((reason: any) => {
                // TODO throw error
                console.log(reason);
                reject(reason);
            });
        });
    }

    return (
        <div className="card-fieldset" style={{width: '25rem'}}>
            <div className="card-header">
                <div className="flex flex-row w-full">
                    <div className="flex-grow-1">Contact details</div>
                    <div className="flex">
                        {
                            !editDetails &&
                            <Button className="p-button-text p-0" onClick={() => {
                                setValue('id', contact.id);
                                setValue('title', contact.title);
                                setValue('firstName', contact.firstName);
                                setValue('lastName', contact.lastName);
                                setValue('ownerId', contact.ownerId);
                                setValue('ownerFullName', contact.ownerFullName);
                                setValue('contactTypeId', contact.contactTypeId);
                                setValue('label', contact.label);
                                setValue('notes', contact.notes);
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
                            <div className="col-4">Title</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{getEnumLabel(ContactTitleEnum, contact.title)}</div>
                        </div>
                        <div className="grid grid-nogutter mt-3">
                            <div className="col-4">First name</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.firstName}</div>
                        </div>
                        <div className="grid grid-nogutter mt-3">
                            <div className="col-4">Last name</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.lastName}</div>
                        </div>
                        <div className="grid grid-nogutter mt-3">
                            <div className="col-4">Owner</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.ownerFullName}</div>
                        </div>
                        <div className="grid grid-nogutter mt-3">
                            <div className="col-4">Type</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.contactTypeName}</div>
                        </div>
                        <div className="grid grid-nogutter mt-3">
                            <div className="col-4">Label</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.label}</div>
                        </div>
                        <div className="grid grid-nogutter mt-3">
                            <div className="col-4">Notes</div>
                            <div className="col-8 overflow-hidden text-overflow-ellipsis">{contact.notes}</div>
                        </div>
                    </div>
                }

                {
                    editDetails &&
                    <div className="content">
                        <form>
                            <div className="field w-full">
                                <label htmlFor="lastName" className="block">Title *</label>
                                <Controller name="title" control={control} render={({field}) => (
                                    <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={ContactTitleEnum}
                                              optionValue="value" optionLabel="label" className="w-full"/>
                                )}/>
                            </div>
                            <div className="field w-full">
                                <label htmlFor="firstName" className="block">First name *</label>
                                <InputText id="firstName" {...register("firstName")} className="w-full"/>
                            </div>
                            <div className="field w-full">
                                <label htmlFor="lastName" className="block">Last name *</label>
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
                            <div className="field w-full">
                                <label htmlFor="contactTypeId" className="block">Type</label>
                                <Controller name="contactTypeId" control={control} render={({field}) => (
                                    <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={contactTypeList}
                                              optionValue="id" optionLabel="name" className="w-full"/>
                                )}/>
                            </div>
                            <div className="field w-full">
                                <label htmlFor="label" className="block">Label</label>
                                <InputText id="label" {...register("label")} className="w-full"/>
                            </div>
                            <div className="field w-full">
                                <label htmlFor="notes" className="block">Notes</label>
                                <InputTextarea id="notes" rows={2} {...register("notes")} autoResize className="w-full"/>
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
    );
}

ContactDetailsSection.propTypes = {
    contactId: PropTypes.string || undefined
}
