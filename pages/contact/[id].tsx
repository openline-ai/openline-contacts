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
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {useEffect} from "react";

function ContactDetails() {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const router = useRouter();
    const {id} = router.query;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: undefined,
            firstName: '',
            lastName: '',
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
                contact: data
            }).then(() => {
                    router.push('/contact');
                }
            ).catch((reason) => {
                if (reason.response.status === 400) {
                    reason.response.data.errors.forEach((error: any) => {
                        formik.setFieldError(error.field, error.message);
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
                }
            }`

            client.request(query, {id: id}).then((response: any) => {
                formik.setValues(response.contact);
            });

        }

    }, [id]);

    const formikTouched: any = formik.touched;
    const formikErrors: any = formik.errors;
    const isFormFieldValid = (property: any) => !!(formikTouched[property] && formikErrors[property]);
    const getFormErrorMessage = (property: string) => {
        return isFormFieldValid(property) && <small className="p-error">{formikErrors[property]}</small>;
    };

    const leftContents = (
        <Fragment>
            <Button onClick={() => formik.handleSubmit()} className='p-button-text'>
                <FontAwesomeIcon icon={faSave} style={{color: 'black'}}/>&nbsp;&nbsp;Save
            </Button>
        </Fragment>
    );

    return (
        <Layout>

            <Toolbar left={leftContents}/>

            <div className="flex">
                <div className="card">

                    <form onSubmit={formik.handleSubmit} className="p-fluid">

                        <div>
                                    <span className="p-float-label">
                                        <InputText id="firstName" name="firstName" value={formik.values.firstName}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({'p-invalid': isFormFieldValid('firstName')})}/>
                                        <label htmlFor="firstName"
                                               className={classNames({'p-error': isFormFieldValid('firstName')})}>First name *</label>
                                    </span>
                            {getFormErrorMessage('firstName')}
                        </div>
                        <div>
                                    <span className="p-float-label">
                                        <InputText id="lastName" name="lastName" value={formik.values.lastName}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({'p-invalid': isFormFieldValid('lastName')})}/>
                                        <label htmlFor="lastName"
                                               className={classNames({'p-error': isFormFieldValid('lastName')})}>Last name *</label>
                                    </span>
                            {getFormErrorMessage('lastName')}
                        </div>
                    </form>
                </div>
            </div>

        </Layout>
    );
}

export default ContactDetails