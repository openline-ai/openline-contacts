import {useRouter} from "next/router";
import Layout from "../../layout/layout";
import {useFormik} from "formik";
import {gql, GraphQLClient} from "graphql-request";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {Toolbar} from "primereact/toolbar";
import {Fragment} from "preact";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus, faRemove, faSave} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {Checkbox} from "primereact/checkbox";

function ContactDetails() {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const router = useRouter();
    const {id} = router.query;

    const formikContactDetails = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: undefined,
            firstName: '',
            lastName: '',
            emails: []
        },
        validate: (data) => {
            let errors = {} as any;

            if (!data.firstName) {
                errors.firstName = 'First name is required.';
            }
            if (!data.lastName) {
                errors.lastName = 'Last name is required.';
            }

            return errors;
        },
        onSubmit: (data) => {
            let query = undefined;

            if (!data.id) {
                query = gql`mutation CreateContact($contact: ContactInput!) {
                    createContact(input: $contact) {
                        id
                    }
                }`
            } else {
                query = gql`mutation UpdateContact($contact: ContactUpdateInput!) {
                    updateContact(input: $contact) {
                        id
                    }
                }`
            }

            client.request(query, {
                contact: {...data, ...{emails: undefined}}
            }).then(() => {
                    router.push('/contact');
                }
            ).catch((reason) => {
                if (reason.response.status === 400) {
                    reason.response.data.errors.forEach((error: any) => {
                        formikContactDetails.setFieldError(error.field, error.message);
                    })
                } else {
                    alert('error');
                }
            });

        }
    });

    const formikEmail = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: undefined,
            email: '',
            label: '',
            primary: false,
        },
        validate: (data) => {
            let errors = {} as any;

            if (!data.email) {
                errors.email = 'Email is required.';
            }

            return errors;
        },
        onSubmit: (data) => {
            let query = undefined;

            if (!data.id) {
                query = gql`mutation AddEmailToContact($contactId: ID!, $email: EmailInput!) {
                    mergeEmailToContact(contactId: $contactId, input: $email) {
                        id
                        email
                        label
                        primary
                    }
                }`
            } else {
                query = gql`mutation UpdateEmailForContact($contactId: ID!, $email: EmailUpdateInput!) {
                    updateEmailInContact(contactId: $contactId, input: $email) {
                        id
                        email
                        label
                        primary
                    }
                }`
            }

            client.request(query, {
                contactId: formikContactDetails.values.id,
                email: data
            }).then((resp: any) => {

                    if (data.id) {
                        setEmails(emails.map((obj: any) => {
                            if (obj.id === data.id) {
                                return resp.updateEmailInContact;
                            }
                            return obj;
                        }));
                    } else {
                        setEmails((prevState: any) => [...prevState, resp.mergeEmailToContact]);
                    }

                }
            ).catch((reason) => {
                if (reason.response.status === 400) {
                    reason.response.data.errors.forEach((error: any) => {
                        formikContactDetails.setFieldError(error.field, error.message);
                    })
                } else {
                    alert('error');
                }
            });

        }
    });

    useEffect(() => {

        if (id !== undefined && id !== 'new') {

            const query = gql`query GetContactById($id: ID!) {
                contact(id: $id) {
                    id
                    firstName
                    lastName
                    emails{
                        id
                        email
                        label
                        primary
                    }
                }
            }`

            client.request(query, {id: id}).then((response: any) => {
                formikContactDetails.setValues(response.contact);

                setEmails(response.contact.emails);
            });

        }

    }, [id]);

    const deleteContact = () => {
        const query = gql`mutation DeleteContact($id: ID!) {

            softDeleteContact(contactId: $id) {
                result
            }

        }`

        client.request(query, {id: id}).then((response: any) => {
            if (response.softDeleteContact.result) {
                router.push('/contact');
            } else {
                //TODO throw error
            }
        });
    }

    const deleteContactEmail = (email: string) => {
        const query = gql`mutation DeleteEmailForContact($contactId: ID!, $email: String!) {
            removeEmailFromContact(contactId: $contactId, email: $email) {
                result
            }
        }`

        client.request(query, {
            contactId: id,
            email: email
        }).then((response: any) => {
            if (response.removeEmailFromContact.result) {
                //todo notification
            } else {
                //TODO throw error
            }
        });
    }

    const formikDetailsTouched: any = formikContactDetails.touched;
    const formikDetailsErrors: any = formikContactDetails.errors;
    const isFormFieldValidDetails = (property: any) => !!(formikDetailsTouched[property] && formikDetailsErrors[property]);
    const getFormErrorMessageDetails = (property: string) => {
        return isFormFieldValidDetails(property) && <small className="p-error">{formikDetailsErrors[property]}</small>;
    };

    const formikEmailTouched: any = formikContactDetails.touched;
    const formikEmailErrors: any = formikContactDetails.errors;
    const isFormFieldValidEmail = (property: any) => !!(formikEmailTouched[property] && formikEmailErrors[property]);
    const getFormErrorMessageEmail = (property: string) => {
        return isFormFieldValidEmail(property) && <small className="p-error">{formikEmailErrors[property]}</small>;
    };

    const [emails, setEmails] = useState([] as any);
    const emailTemplateRow = (email: any) => {
        return <div style={{border: 'solid 1px red'}}>Email: {email.email}; Label: {email.label};
            Primary: {email.primary ? 'Yes' : 'No'}

            <Button onClick={() => {
                formikEmail.setValues(email);
            }} className='p-button-text'>
                <FontAwesomeIcon icon={faEdit} style={{color: 'black'}}/>&nbsp;&nbsp;Edit
            </Button>

            <Button onClick={() => {
                deleteContactEmail(email.email)
            }} className='p-button-text'>
                <FontAwesomeIcon icon={faRemove} style={{color: 'black'}}/>&nbsp;&nbsp;Delete
            </Button>

        </div>
    };

    const leftContents = (
        <Fragment>
            <Button onClick={() => formikContactDetails.handleSubmit()} className='p-button-text'>
                <FontAwesomeIcon icon={faSave} style={{color: 'black'}}/>&nbsp;&nbsp;Save
            </Button>
            <Button onClick={() => deleteContact()} className='p-button-text'>
                <FontAwesomeIcon icon={faRemove} style={{color: 'black'}}/>&nbsp;&nbsp;Delete
            </Button>
        </Fragment>
    );

    const [emailLabels] = useState([
        {
            value: 'MAIN',
            label: 'Main'
        },
        {
            value: 'WORK',
            label: 'Work'
        },
        {
            value: 'HOME',
            label: 'Home'
        },
        {
            value: 'OTHER',
            label: 'Other'
        }
    ]);

    return (
        <Layout>

            <Toolbar left={leftContents} style={{marginBottom: '50px'}}/>

            <div className="flex">
                <div className="card">

                    <form onSubmit={formikContactDetails.handleSubmit} className="p-fluid">

                        <div>
                            <span className="p-float-label">
                                <InputText id="firstName" name="firstName" value={formikContactDetails.values.firstName}
                                           onChange={formikContactDetails.handleChange} autoFocus
                                           className={classNames({'p-invalid': isFormFieldValidDetails('firstName')})}/>
                                <label htmlFor="firstName"
                                       className={classNames({'p-error': isFormFieldValidDetails('firstName')})}>First name *</label>
                            </span>
                            {getFormErrorMessageDetails('firstName')}
                        </div>
                        <div>
                            <span className="p-float-label">
                                <InputText id="lastName" name="lastName" value={formikContactDetails.values.lastName}
                                           onChange={formikContactDetails.handleChange} autoFocus
                                           className={classNames({'p-invalid': isFormFieldValidDetails('lastName')})}/>
                                <label htmlFor="lastName"
                                       className={classNames({'p-error': isFormFieldValidDetails('lastName')})}>Last name *</label>
                            </span>
                            {getFormErrorMessageDetails('lastName')}
                        </div>
                    </form>
                </div>
            </div>

            <div className="flex" style={{marginTop: '50px'}}>
                <div className="card">

                    <form onSubmit={formikEmail.handleSubmit} className="p-fluid">

                        <div>
                            Add email<br/><br/><br/>
                            <span className="p-float-label">
                                <InputText id="email" name="email" value={formikEmail.values.email}
                                           onChange={formikEmail.handleChange} autoFocus
                                           className={classNames({'p-invalid': isFormFieldValidEmail('email')})}/>
                                <label htmlFor="email"
                                       className={classNames({'p-error': isFormFieldValidEmail('firstName')})}>Email *</label>
                            </span>
                            {getFormErrorMessageEmail('email')}
                        </div>
                        <div>
                            <span className="p-float-label">
                                <Dropdown id="label" name="label" value={formikEmail.values.label}
                                          onChange={formikEmail.handleChange} options={emailLabels} optionLabel="label"
                                          className={classNames({'p-invalid': isFormFieldValidEmail('label')})}
                                          optionValue="value"/>
                                <label htmlFor="label">Label *</label>
                            </span>
                            {getFormErrorMessageEmail('label')}
                        </div>
                        <div>
                            <span className="p-float-label">
                                <Checkbox inputId="primary" name="primary"
                                          onChange={formikEmail.handleChange}
                                          checked={formikEmail.values.primary}/>
                                 <label htmlFor="label">Primary</label>
                            </span>
                        </div>

                        <Button onClick={() => formikEmail.handleSubmit()} className='p-button-text'>
                            <FontAwesomeIcon icon={faPlus} style={{color: 'black'}}/>&nbsp;&nbsp;add email
                        </Button>
                    </form>
                </div>
            </div>

            <div>

                {emails && emails.map((e: any) => {
                    return emailTemplateRow(e)
                })}

            </div>


        </Layout>
    );
}

export default ContactDetails