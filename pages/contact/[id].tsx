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

function ContactDetails() {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const router = useRouter();
    const {id} = router.query;

    const formik = useFormik({
        initialValues: {
            customerId: '',
            first_name: '',
            last_name: '',
            middle_name: '',
            phone_number: '',
            email: '',
            address: '',
        },
        validate: (data) => {
            let errors = {} as any;

            if (!data.first_name) {
                errors.first_name = 'First name is required.';
            }
            if (!data.last_name) {
                errors.last_name = 'Last name is required.';
            }

            if (!data.email) {
                errors.email = 'Email is required.';
            }

            return errors;
        },
        onSubmit: (data) => {

            const query = gql`
              mutation createContact($first_name: String, $last_name: String, $middle_name: String, $phone_number: String, $email: String, $address: String) {
                  createContact(input: {
                      first_name: $first_name,
                      last_name: $last_name,
                      middle_name: $middle_name,
                      phone_number: $phone_number,
                      email: $email,
                      address: $address
                  }) {
                  id
                  }
              }`

            client.request(query, data).then(() => {
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
                                        <InputText id="first_name" name="first_name" value={formik.values.first_name}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({'p-invalid': isFormFieldValid('first_name')})}/>
                                        <label htmlFor="first_name"
                                               className={classNames({'p-error': isFormFieldValid('first_name')})}>First name *</label>
                                    </span>
                            {getFormErrorMessage('first_name')}
                        </div>
                        <div>
                                    <span className="p-float-label">
                                        <InputText id="last_name" name="last_name" value={formik.values.last_name}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({'p-invalid': isFormFieldValid('last_name')})}/>
                                        <label htmlFor="last_name"
                                               className={classNames({'p-error': isFormFieldValid('last_name')})}>Last name *</label>
                                    </span>
                            {getFormErrorMessage('last_name')}
                        </div>
                        <div>
                                    <span className="p-float-label">
                                        <InputText id="middle_name" name="middle_name" value={formik.values.middle_name}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({'p-invalid': isFormFieldValid('middle_name')})}/>
                                        <label htmlFor="middle_name"
                                               className={classNames({'p-error': isFormFieldValid('middle_name')})}>Middle name</label>
                                    </span>
                            {getFormErrorMessage('middle_name')}
                        </div>
                        <div>
                                    <span className="p-float-label">
                                        <InputText id="phone_number" name="phone_number"
                                                   value={formik.values.phone_number}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({'p-invalid': isFormFieldValid('phone_number')})}/>
                                        <label htmlFor="phone_number"
                                               className={classNames({'p-error': isFormFieldValid('phone_number')})}>Phone</label>
                                    </span>
                            {getFormErrorMessage('phone_number')}
                        </div>
                        <div>
                                    <span className="p-float-label">
                                        <InputText id="email" name="email" value={formik.values.email}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({'p-invalid': isFormFieldValid('email')})}/>
                                        <label htmlFor="email"
                                               className={classNames({'p-error': isFormFieldValid('email')})}>Email *</label>
                                    </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div>
                                    <span className="p-float-label">
                                        <InputText id="address" name="address" value={formik.values.address}
                                                   onChange={formik.handleChange} autoFocus
                                                   className={classNames({'p-invalid': isFormFieldValid('address')})}/>
                                        <label htmlFor="address"
                                               className={classNames({'p-error': isFormFieldValid('address')})}>Address</label>
                                    </span>
                            {getFormErrorMessage('address')}
                        </div>
                    </form>
                </div>
            </div>

        </Layout>
    );
}

export default ContactDetails