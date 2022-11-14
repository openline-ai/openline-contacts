import PropTypes, {string} from "prop-types";
import {useEffect, useImperativeHandle, useRef, useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {OverlayPanel} from "primereact/overlaypanel";
import {Menu} from "primereact/menu";
import ContactEmailTemplate from "./contactEmailTemplate";
import {uuidv4} from "../../utils/uuid-generator";

function ContactCommunication(props: any) {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const addCommunicationChannelContainerRef = useRef<OverlayPanel>(null);

    const [emails, setEmails] = useState([] as any);

    useEffect(() => {

        if (props.contactId !== undefined) {

            const query = gql`query LoadCommunicationsChannelsForContactWithId($id: ID!) {
                contact(id: $id) {
                    emails{
                        id
                        email
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
            });
        }

    }, [props.contactId]);

    const itemSaved = (data: any) => {
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

    const cancelEdit = (uiKey: string) => {
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

    return (
        <div className='card-fieldset mt-3' style={{width: '25rem'}}>
            <div className="card-header">
                <div className="flex flex-row w-full">
                    <div className="flex-grow-1">Communication</div>
                    <div className="flex">

                        <Button className="p-button-text p-0" onClick={(e: any) => addCommunicationChannelContainerRef?.current?.toggle(e)}>
                            <FontAwesomeIcon size="xs" icon={faCirclePlus} style={{color: 'black'}}/>
                        </Button>

                        <OverlayPanel ref={addCommunicationChannelContainerRef} dismissable>
                            <Menu model={[
                                {
                                    label: 'Email',
                                    command: () => {
                                        setEmails([...emails, {
                                            id: undefined,
                                            email: '',
                                            label: '',
                                            primary: false,
                                            uiKey: uuidv4(), //TODO make sure the ID is unique in the array
                                            newItem: true // this is used to remove the item from the emails array in case of cancel new item
                                        }]);
                                        addCommunicationChannelContainerRef?.current?.hide();
                                    }
                                },
                                {
                                    label: 'Phone number',
                                    command: () => {
                                        console.log('new phone number');
                                        addCommunicationChannelContainerRef?.current?.hide();
                                    }
                                }
                            ]}/>
                        </OverlayPanel>
                    </div>
                </div>
            </div>
            <div className="card-body">

                {
                    emails.length === 0 &&
                    <div className="display">
                        No communication channels
                    </div>
                }

                {
                    emails.map((e: any) => {
                        return <ContactEmailTemplate key={e.uiKey}
                                                     contactId={props.contactId}
                                                     email={e}
                                                     initialEditState={e.newItem}
                                                     notifySave={(e: any) => itemSaved(e)}
                                                     notifyDelete={(uiKey: string) => emailDeleted(uiKey)}
                                                     notifyCancelEdit={(uiKey: string) => cancelEdit(uiKey)}
                        />
                    })
                }

            </div>
        </div>
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