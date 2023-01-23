import PropTypes, {string} from "prop-types";
import {useEffect, useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {uuidv4} from "../../utils/uuid-generator";
import ContactOrganizationTemplate from "./contactOrganizationTemplate";
import {useGraphQLClient} from "../../utils/graphQLClient";

function ContactOrganization(props: any) {
    const client =  useGraphQLClient();

    const [roles, setRoles] = useState([] as any);

    useEffect(() => {

        if (props.contactId !== undefined) {

            const query = gql`query LoadOrganizationsForContactWithId($id: ID!) {
                contact(id: $id) {
                    roles{
                        id
                        organization{
                            id
                            name
                        }
                        jobTitle
                    }
                }
            }`

            client.request(query, {id: props.contactId}).then((response: any) => {
                response.contact.roles.forEach((e: any) => {
                    e.uiKey = uuidv4(); //TODO make sure the ID is unique in the array
                    e.newItem = false;
                    e.organizationId = e.organization?.id ?? undefined;
                    e.organizationName = e.organization?.name ?? undefined;
                });
                setRoles(response.contact.roles);
            });
        }

    }, [props.contactId]);

    const organizationRoleSaved = (data: any) => {
        setRoles(roles.map((e: any) => {
            if (e.uiKey !== data.uiKey) {
                //if the saved organization position is marked as primary, we unmark the others
                return e;
            } else {
                return {...data, ...{newItem: false}};
            }
        }));
    }

    const organizationRoleDeleted = (uiKey: string) => {
        setRoles(roles.filter((e: any) => {
            if (e.uiKey !== uiKey) {
                return e;
            }
        }));
    }

    const organizationRoleCancelEdit = (uiKey: string) => {
        setRoles(roles.filter((e: any) => {
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
        <div className='card-fieldset' style={{width: '100%'}}>
            <div className="card-header">
                <div className="flex flex-row w-full">
                    <div className="flex-grow-1">Organizations</div>
                    <div className="flex">

                        <Button className="p-button-text p-0" onClick={(e: any) => {
                            setRoles([...roles, {
                                id: undefined,
                                organizationId: undefined,
                                organizationName: '',
                                jobTitle: '',
                                uiKey: uuidv4(), //TODO make sure the ID is unique in the array
                                newItem: true // this is used to remove the item from the organization positions array in case of cancel new item
                            }]);
                        }}>
                            <FontAwesomeIcon size="xs" icon={faCirclePlus} style={{color: 'black'}}/>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="card-body">

                {
                    roles.length === 0 &&
                    <div className="display">
                        No organizations associated
                    </div>
                }

                {
                    roles.map((e: any) => {
                        return <ContactOrganizationTemplate key={e.uiKey}
                                                            contactId={props.contactId}
                                                            organizationRole={e}
                                                            initialEditState={e.newItem}
                                                            notifySave={(e: any) => organizationRoleSaved(e)}
                                                            notifyDelete={(uiKey: string) => organizationRoleDeleted(uiKey)}
                                                            notifyCancelEdit={(uiKey: string) => organizationRoleCancelEdit(uiKey)}
                        />
                    })
                }

            </div>
        </div>
    );
}

ContactOrganization.propTypes = {
    contactId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(string)
    ]) || undefined,
    className: PropTypes.arrayOf(string)
}

export default ContactOrganization