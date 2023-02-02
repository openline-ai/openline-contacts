import {toast} from "react-toastify";
import {useForm} from "react-hook-form";
import {NoteEditor} from "../molecules/note-editor";
import {useGraphQLClient} from "../../utils/graphQLClient";
import {CreateOrganizationNote} from "../../services/organizationService";
import {Note} from "../../models/contact";
import {NoteEditorModes} from "../molecules/note-editor/NoteEditor";
import {CardHeading} from "../atoms/cardHeading";


export function CreateOrganisationNote({organizationId, refreshData}: any) {
    const client =  useGraphQLClient();

    const {register, handleSubmit, setValue, getValues, control, reset} = useForm({
        defaultValues: {
            id: '',
            html: '',
            htmlEnhanced: ''
        }
    });

    const onSubmit = handleSubmit((dataToSubmit) => {
        dataToSubmit.html = dataToSubmit?.htmlEnhanced?.replaceAll(/.src(\S*)/g, ""); //remove src attribute to not send the file bytes in here
            CreateOrganizationNote(client, organizationId, dataToSubmit).then((savedNote: Note) => {
                refreshData();
                reset({
                    id: '',
                    html: '',
                    htmlEnhanced: ''
                })

                toast.success("Note added successfully!");
            }).catch((reason: any) => {
                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
    });



    return (
        <div>
            <CardHeading> Create note </CardHeading>
            <NoteEditor
                fieldName="htmlEnhanced"
                fieldController={control}
                onGetFieldValue={getValues}
                mode={NoteEditorModes.ADD}
                onTextChange={(e: any) => {
                    setValue('htmlEnhanced', e.htmlValue)
                }}
                onSave={onSubmit}
            />
        </div>
    );
}