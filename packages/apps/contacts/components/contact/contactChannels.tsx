import PropTypes, {string} from "prop-types";
import React, {useEffect, useRef, useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {OverlayPanel, OverlayPanelEventType} from "primereact/overlaypanel";
import {Menu} from "primereact/menu";
import ContactEmailTemplate from "./contact-detail-preview-template/contactEmailTemplate";
import {uuidv4} from "../../utils/uuid-generator";
import ContactPhoneNumberTemplate from "./contact-detail-preview-template/contactPhoneNumberTemplate";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {Button, Divider} from "../atoms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function ContactCommunication(props: any) {
    const client = new GraphQLClient(`/customer-os-api/query`);

    const addCommunicationChannelContainerRef = useRef<OverlayPanel>(null);

    const [emails, setEmails] = useState([] as any);
    const [phoneNumbers, setPhoneNumbers] = useState([] as any);

    useEffect(() => {
        if (props.contactId) {

            const query = gql`query LoadCommunicationsChannelsForContactWithId($id: ID!) {
                contact(id: $id) {
                    emails{
                        id
                        email
                        label
                        primary
                    }
                    phoneNumbers{
                        id
                        e164
                        label
                        primary
                    }
                }
            }`

            client.request(query, {id: props.contactId}).then((response: any) => {
                response.contact.emails.forEach((e: any) => {
                    e.uiKey = uuidv4(); //TODO make sure the ID is unique in the array
                    e.newItem = false;
                });
                setEmails(response.contact.emails);

                response.contact.phoneNumbers.forEach((e: any) => {
                    e.uiKey = uuidv4(); //TODO make sure the ID is unique in the array
                    e.newItem = false;
                });
                setPhoneNumbers(response.contact.phoneNumbers);
            });
        }

    }, [props.contactId]);

    const emailSaved = (data: any) => {
        setEmails(emails.map((e: any) => {
            if (e.uiKey !== data.uiKey) {
                //if the saved email is marked as primary, we unmark the others
                return data.primary ? {...e, ...{primary: false}} : e;
            } else {
                return {...data, ...{newItem: false}};
            }
        }));
    }

    const emailDeleted = (uiKey: string) => {
        setEmails(emails.filter((e: any) => {
            if (e.uiKey !== uiKey) {
                return e;
            }
        }));
    }

    const emailCancelEdit = (uiKey: string) => {
        setEmails(emails.filter((e: any) => {
            if (e.uiKey !== uiKey) {
                return e;
            } else {
                if (!e.newItem) {
                    return e;
                }
            }
        }));
    }

    const phoneNumberSaved = (data: any) => {
        setPhoneNumbers(phoneNumbers.map((e: any) => {
            if (e.uiKey !== data.uiKey) {
                //if the saved email is marked as primary, we unmark the others
                return data.primary ? {...e, ...{primary: false}} : e;
            } else {
                return {...data, ...{newItem: false}};
            }
        }));
    }

    const phoneNumberDeleted = (uiKey: string) => {
        setPhoneNumbers(phoneNumbers.filter((e: any) => {
            if (e.uiKey !== uiKey) {
                return e;
            }
        }));
    }

    const phoneNumberCancelEdit = (uiKey: string) => {
        setPhoneNumbers(phoneNumbers.filter((e: any) => {
            if (e.uiKey !== uiKey) {
                return e;
            } else {
                if (!e.newItem) {
                    return e;
                }
            }
        }));
    }

    return (
        <>
            <div className="card-header">
                <div className="flex flex-row w-full align-items-center">
                    <h1 className="text-gray-900 text-xl">Communication</h1>
                    <div className="flex ml-3">
                        {/* fixme */}
                        <div className='flex flex-1 justify-content-end'>
                            <Button mode="primary" onClick={(e: OverlayPanelEventType) => addCommunicationChannelContainerRef?.current?.toggle(e)}>
                                <FontAwesomeIcon icon={faPlus} />
                                Add
                            </Button>
                        </div>
                        <OverlayPanel ref={addCommunicationChannelContainerRef} dismissable>
                            <Menu model={[
                                {
                                    label: 'Email',
                                    command: () => {
                                        setEmails([...emails, {
                                            id: undefined,
                                            email: '',
                                            label: '',
                                            primary: emails.length === 0,
                                            uiKey: uuidv4(), //TODO make sure the ID is unique in the array
                                            newItem: true // this is used to remove the item from the emails array in case of cancel new item
                                        }]);
                                        addCommunicationChannelContainerRef?.current?.hide();
                                    }
                                },
                                {
                                    label: 'Phone number',
                                    command: () => {
                                        setPhoneNumbers([...phoneNumbers, {
                                            id: undefined,
                                            e164: '',
                                            label: '',
                                            primary: phoneNumbers.length === 0,
                                            uiKey: uuidv4(), //TODO make sure the ID is unique in the array
                                            newItem: true // this is used to remove the item from the phone numbers array in case of cancel new item
                                        }]);
                                        addCommunicationChannelContainerRef?.current?.hide();
                                    }
                                }
                            ]}/>
                        </OverlayPanel>
                    </div>
                </div>
            </div>
            <div>

                {
                    emails.length === 0 &&
                    <div className="display">
                        No communication channels
                    </div>
                }

                {
                    emails.map((e: any, i:number) => {
                        return <>
                            <ContactEmailTemplate key={e.uiKey}
                                                  contactId={props.contactId}
                                                  email={e}
                                                  initialEditState={e.newItem}
                                                  notifySave={(e: any) => emailSaved(e)}
                                                  notifyDelete={(uiKey: string) => emailDeleted(uiKey)}
                                                  notifyCancelEdit={(uiKey: string) => emailCancelEdit(uiKey)}
                            />
                                <Divider/>
                        </>
                   
                    })
                }

                {
                    phoneNumbers.map((e: any) => {
                        return <ContactPhoneNumberTemplate key={e.uiKey}
                                                     contactId={props.contactId}
                                                     phoneNumber={e}
                                                     initialEditState={e.newItem}
                                                     notifySave={(e: any) => phoneNumberSaved(e)}
                                                     notifyDelete={(uiKey: string) => phoneNumberDeleted(uiKey)}
                                                     notifyCancelEdit={(uiKey: string) => phoneNumberCancelEdit(uiKey)}
                        />
                    })
                }

            </div>
        </>
    );
}

ContactCommunication.propTypes = {
    contactId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(string)
    ]) || undefined,
    className: PropTypes.arrayOf(string)
}

export default ContactCommunication