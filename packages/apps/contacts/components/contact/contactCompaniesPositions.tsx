import PropTypes, {string} from "prop-types";
import {useEffect, useState} from "react";
import {gql, GraphQLClient} from "graphql-request";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {uuidv4} from "../../utils/uuid-generator";
import ContactCompanyPositionTemplate from "./contactCompanyPositionTemplate";

function ContactCompaniesPositions(props: any) {
    const client = new GraphQLClient(`/customer-os-api/query`);

    const [companyPositions, setCompanyPositions] = useState([] as any);

    useEffect(() => {

        if (props.contactId !== undefined) {

            const query = gql`query LoadCompaniesForContactWithId($id: ID!) {
                contact(id: $id) {
                    roles{
                        id
                        company{
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
                    e.companyId = e.company.id;
                    e.companyName = e.company.name;
                });
                setCompanyPositions(response.contact.roles);
            });
        }

    }, [props.contactId]);

    const companyPositionSaved = (data: any) => {
        setCompanyPositions(companyPositions.map((e: any) => {
            if (e.uiKey !== data.uiKey) {
                //if the saved company position is marked as primary, we unmark the others
                return e;
            } else {
                return {...data, ...{newItem: false}};
            }
        }));
    }

    const companyPositionDeleted = (uiKey: string) => {
        setCompanyPositions(companyPositions.filter((e: any) => {
            if (e.uiKey !== uiKey) {
                return e;
            }
        }));
    }

    const companyPositionCancelEdit = (uiKey: string) => {
        setCompanyPositions(companyPositions.filter((e: any) => {
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
                    <div className="flex-grow-1">Companies</div>
                    <div className="flex">

                        <Button className="p-button-text p-0" onClick={(e: any) => {
                            setCompanyPositions([...companyPositions, {
                                id: undefined,
                                companyId: undefined,
                                companyName: '',
                                jobTitle: '',
                                uiKey: uuidv4(), //TODO make sure the ID is unique in the array
                                newItem: true // this is used to remove the item from the company positions array in case of cancel new item
                            }]);
                        }}>
                            <FontAwesomeIcon size="xs" icon={faCirclePlus} style={{color: 'black'}}/>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="card-body">

                {
                    companyPositions.length === 0 &&
                    <div className="display">
                        No companies associated
                    </div>
                }

                {
                    companyPositions.map((e: any) => {
                        return <ContactCompanyPositionTemplate key={e.uiKey}
                                                               contactId={props.contactId}
                                                               companyPosition={e}
                                                               initialEditState={e.newItem}
                                                               notifySave={(e: any) => companyPositionSaved(e)}
                                                               notifyDelete={(uiKey: string) => companyPositionDeleted(uiKey)}
                                                               notifyCancelEdit={(uiKey: string) => companyPositionCancelEdit(uiKey)}
                        />
                    })
                }

            </div>
        </div>
    );
}

ContactCompaniesPositions.propTypes = {
    contactId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(string)
    ]) || undefined,
    className: PropTypes.arrayOf(string)
}

export default ContactCompaniesPositions