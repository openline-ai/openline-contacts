import React, {useEffect, useState} from "react";
import {useGraphQLClient} from "../../../utils/graphQLClient";
import {TagInput} from "../../atoms/tag-input";
import {
    AddTagForContact,
    GetTagsForContact,
    RemoveTagFromContact
} from "../../../services/contactService";
import {ContactTag} from "../../../models/contact";
import {toast} from "react-toastify";
import {CreateTag, DeleteTag, GetTags} from "../../../services/contactTags";
import {useRouter} from "next/router";

export const ContactTags = () => {
    const client =  useGraphQLClient();
    const router = useRouter();
    const [tags, setTags] = useState<Array<ContactTag>>([]);
    const [tagOptions, setTagOptions] = useState<Array<ContactTag>>([]);



    useEffect(() => {
        GetTags(client)
            .then((data ) => {
                setTagOptions(data)
            })
            .catch((reason: any) => {
                toast.error(`Something went wrong while loading tags`);
            });
        GetTagsForContact(client, router.query.id as string)
            .then((data ) => {
                //@ts-ignore
                setTags(data)
            })
            .catch((reason: any) => {
                toast.error(`Something went wrong while loading contact tags`);
            });

    },[router.query.id])
    const handleAddTagToContact = (tag: {name:string, id: string}) => {
        AddTagForContact(client, {tagId: tag.id, contactId: router.query.id })
            .then(() => {
                setTags([...tags, tag])
                toast.success("Tag added to contact");
            })
            .catch((e) => {
                toast.error(`Something went wrong while adding tag to contact!`);
            })
    }
    const handleCreateTag = (name: string) => {
        CreateTag(client, {name})
            .then(({id, name}) => {
                toast.success("Tag created");
                handleAddTagToContact({id, name})
            })
            .catch((reason: any) => {
                toast.error(`Something went wrong while creating new tag!`);
        });
    }
    const handleDeleteTag = (id: string) => {
        DeleteTag(client, id)
            .then(() => {
                toast.success("Tag deleted!");
                const newOptions = tagOptions.filter((data) => data.id !== id)
                setTagOptions(newOptions)
            })
            .catch((reason: any) => {
                toast.error(`Something went wrong while deleting tag`);
        });
    }


    const handleRemoveTagFromContact = (tagId:string) => {
        RemoveTagFromContact(client, {contactId: router.query.id as string, tagId })
            .then(() => {
                setTags(tags.filter(data => data.id !== tagId))
                toast.success("Tag removed from contact");
            })
            .catch((reason: any) => {
                toast.error(`Something went wrong while removing tag from contact!`);
            });
    }

    return (
        <div>
            <TagInput
                onNewTag={handleCreateTag}
                onTagChange={() => null}
                onTagRemove={handleRemoveTagFromContact}
                tags={tags}
                onSetTags={setTags}
                options={tagOptions || []}
                onTagSelect={handleAddTagToContact}
                onTagDelete={handleDeleteTag}
            />

        </div>

    );
}

