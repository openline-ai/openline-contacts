import {InputText} from "primereact/inputtext";
import {CustomField, CustomFieldDefinition, FieldSetDefinition} from "../../models/customFields";

export type CustomFieldTemplateProps = {
    id: string;
    data: CustomField;
    definition: CustomFieldDefinition;
    register: Function;
}

export type FieldSetTemplateProps = {
    id: string;
    name: string;
    definitionId: string;
    customFields: CustomFieldTemplateProps[];
    register: Function;
}

export type EntityDefinitionTemplateProps = {
    name: string;
    fields: (CustomFieldTemplateProps | FieldSetTemplateProps)[];
    register: Function;
}


export function CustomFieldTemplate(props: CustomFieldTemplateProps) {
    const label = props.data.name ?? props.definition.name;
    return <div className="field w-full">
        <label htmlFor={props.id} className="block">{label} {props.definition?.mandatory ? '*' : ''}</label>
        <InputText id={props.id} {...props.register(props.id)} className="w-full"/>
    </div>
}

export function FieldSetTemplate(props: FieldSetTemplateProps) {
    return <div className="field w-full">
        <div className="mb-3">{props.name}</div>
        <div className="pl-3">
            {
                props.customFields.map((c: CustomFieldTemplateProps) => {
                    return <CustomFieldTemplate key={c.id} id={c.id} definition={c.definition} data={c.data} register={props.register}/>
                })
            }
        </div>
    </div>
}

export function EntityDefinitionTemplate(props: EntityDefinitionTemplateProps) {
    return <div className="field w-full">
            {
                props.fields.map((c: (CustomFieldTemplateProps | FieldSetTemplateProps)) => {
                    if((c as CustomFieldTemplateProps).data) {
                        let customField = c as CustomFieldTemplateProps;
                        return <CustomFieldTemplate key={c.id} id={c.id} definition={customField.definition} data={customField.data} register={props.register}/>
                    } else {
                        let fieldSet = c as FieldSetTemplateProps;
                        return <FieldSetTemplate key={c.id} id={c.id} name={fieldSet.name} definitionId={fieldSet.definitionId} customFields={fieldSet.customFields} register={props.register}/>
                    }
                })
            }
    </div>
}