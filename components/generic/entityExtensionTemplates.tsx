import {InputText} from "primereact/inputtext";
import {CustomField, CustomFieldDefinition, FieldSet, FieldSetDefinition} from "../../models/customFields";

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

export function CustomFieldEditTemplate(props: CustomFieldTemplateProps) {
    const label = props.data.name ?? props.definition.name;
    return <div className="field w-full">
        <label htmlFor={props.id} className="block">{label} {props.definition?.mandatory ? '*' : ''}</label>
        <InputText id={props.id} {...props.register(props.id)} className="w-full"/>
    </div>
}

export function FieldSetEditTemplate(props: FieldSetTemplateProps) {
    return <div className="field w-full">
        <div className="mb-3">{props.name}</div>
        <div className="pl-3">
            {
                props.customFields.map((c: CustomFieldTemplateProps) => {
                    return <CustomFieldEditTemplate key={c.id} id={c.id} definition={c.definition} data={c.data} register={props.register}/>
                })
            }
        </div>
    </div>
}

export function EntityDefinitionEditTemplate(props: EntityDefinitionTemplateProps) {
    return <div className="field w-full">
        {
            props.fields.map((c: (CustomFieldTemplateProps | FieldSetTemplateProps)) => {
                if ((c as CustomFieldTemplateProps).data) {
                    let customField = c as CustomFieldTemplateProps;
                    return <CustomFieldEditTemplate
                        key={c.id}
                        id={c.id}
                        definition={customField.definition}
                        data={customField.data}
                        register={props.register}/>
                } else {
                    let fieldSet = c as FieldSetTemplateProps;
                    return <FieldSetEditTemplate
                        key={c.id} id={c.id}
                        name={fieldSet.name}
                        definitionId={fieldSet.definitionId}
                        customFields={fieldSet.customFields}
                        register={props.register}/>
                }
            })
        }
    </div>
}

export type CustomFieldViewTemplateProps = {
    id: string;
    label: string;
    value: string;
}

export type FieldSetViewTemplateProps = {
    id: string;
    label: string;
    fields: CustomFieldViewTemplateProps[];
}

export type EntityDefinitionViewTempalteProps = {
    fields: (CustomFieldViewTemplateProps | FieldSetViewTemplateProps)[];
}

export function CustomFieldViewTemplate(props: CustomFieldViewTemplateProps) {
    return <div className="grid grid-nogutter mb-3">
        <div className="col-4">{props.label}</div>
        <div className="col-8 overflow-hidden text-overflow-ellipsis">{props.value}</div>
    </div>
}

export function FieldSetViewTemplate(props: FieldSetViewTemplateProps) {
    return <div className="w-full">
        <div className="mb-1">{props.label} {props.fields.length}</div>
        <div className="pl-2">
            {
                props.fields.map((c: CustomFieldViewTemplateProps) => {
                    return <CustomFieldViewTemplate
                        key={c.id}
                        id={c.id}
                        label={c.label}
                        value={c.value}
                    />
                })
            }
        </div>
    </div>
}

export function EntityDefinitionViewTemplate(props: EntityDefinitionViewTempalteProps) {
    return <div style={{marginBottom: '-1rem'}}>
        {
            props.fields.length === 0 &&
            <div className="mb-3">No data available</div>
        }

        {props.fields.length > 0 && props.fields.map((c: (CustomFieldViewTemplateProps | FieldSetViewTemplateProps)) => {
            if ((c as CustomFieldViewTemplateProps).value) {
                let customField = c as CustomFieldViewTemplateProps;
                return <CustomFieldViewTemplate
                    key={c.id}
                    id={c.id}
                    label={c.label}
                    value={customField.value}
                />
            } else {
                let fieldSet = c as FieldSetViewTemplateProps;
                return <FieldSetViewTemplate
                    key={c.id}
                    id={c.id}
                    label={c.label}
                    fields={fieldSet.fields}/>
            }
        })
        }
    </div>
}