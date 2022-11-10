
export function isFormFieldValid (property: any, formikTouched: any, formikErrors: any){
    return (formikTouched[property] && formikErrors[property]);
}

export function getFormErrorMessage(property: string, formikTouched: any, formikErrors: any) {
    return isFormFieldValid(property, formikTouched, formikErrors) && '<small className="p-error">{formikErrors[property]}</small>';
}