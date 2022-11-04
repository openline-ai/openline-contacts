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
import {faRemove, faSave} from "@fortawesome/free-solid-svg-icons";
import {useEffect} from "react";

function ContactGroupEdit() {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const router = useRouter();
    const {id} = router.query;

    const formik = useFormik({
        initialValues: {
            id: undefined,
            name: '',
        },
        validate: (data) => {
            let errors = {} as any;

            if (!data.name) {
                errors.name = 'Name is required.';
            }

            return errors;
        },
        onSubmit: (data) => {
            let query = undefined;
            let variables = undefined;

            if (!data.id) {
                query = gql`mutation CreateContactGroup($contactGroup: ContactGroupInput!) {
                    createContactGroup(input: $contactGroup) {
                        id
                    }
                }`;
            } else {
                query = gql`mutation UpdateContact($contactGroup: ContactGroupUpdateInput!) {
                    updateContactGroup(input: $contactGroup) {
                        id
                    }
                }`
            }

            client.request(query, {
                contactGroup: data
            }).then(() => {
                    router.push('/contactGroup');
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
            <Button onClick={() => deleteContactGroup()} className='p-button-text'>
                <FontAwesomeIcon icon={faRemove} style={{color: 'black'}}/>&nbsp;&nbsp;Delete
            </Button>
        </Fragment>
    );

    useEffect(() => {

        if (id !== undefined && id !== 'new') {

            const query = gql`query GetContactGroupById($id: ID!) {

                contactGroup(id: $id) {
                    id
                    name
                }

            }`

            client.request(query, {id: id}).then((response: any) => {
                formik.setValues(response.contactGroup);
            });

        }

    }, [id]);

    const deleteContactGroup = () => {
        const query = gql`mutation DeleteContactGroup($id: ID!) {

            deleteContactGroupAndUnlinkAllContacts(id: $id) {
                result
            }

        }`

        client.request(query, {id: id}).then((response: any) => {
            if(response.deleteContactGroupAndUnlinkAllContacts.result) {
                router.push('/contactGroup');
            } else {
                //TODO throw error
            }
        });
    }

    return (
        <Layout>

            <Toolbar left={leftContents}/>

            <div className="flex">
                <div className="card">

                    <form onSubmit={formik.handleSubmit} className="p-fluid">

                        <div>
                                    <span className="p-float-label">
                                        <InputText id="name" name="name" value={formik.values.name}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({'p-invalid': isFormFieldValid('name')})}/>
                                        <label htmlFor="name"
                                               className={classNames({'p-error': isFormFieldValid('name')})}>Name *</label>
                                    </span>
                            {getFormErrorMessage('name')}
                        </div>
                    </form>
                </div>
            </div>

        </Layout>
    );
}

export default ContactGroupEdit