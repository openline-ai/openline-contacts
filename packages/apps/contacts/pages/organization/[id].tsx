import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {Organization} from "../../models/organization";
import {GetOrganization} from "../../services/organizationService";
import {FullScreenModeLayout} from "../../components/organisms/fullscreen-mode-layout";
import EditOrganization from "../../components/organization/EditOrganization";
import styles from './organisation-preview.module.scss'
import {OrganizationContactList} from "../../components/organization/ContactsList";
import {OrganizationHistory} from "../../components/organization/ConversationHistory";
import {Skeleton} from "primereact/skeleton";
import {Button} from "../../components/atoms";
import {useGraphQLClient} from "../../utils/graphQLClient";
import {CardHeading} from "../../components/atoms/cardHeading";

function OrganizationEdit() {
    const client =  useGraphQLClient();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [organization, setOrganization] = useState(null);
    const [contactInOrganisation, setContactInOrganization] = useState([]);
    const [reloadDetails, setReloadDetails] = useState(false);
    const [createMode, setCreateMode] = useState(false);


    useEffect(() => {
        if (router.query.id !== undefined && router.query.id === 'new') {
            setCreateMode(true);
            setLoading(false)
        }
    }, [router.query.id]);

    useEffect(() => {
        if(router.query.id !== undefined && router.query.id !== 'new') {
            setLoading(true)
            setCreateMode(false)
            GetOrganization(client, router.query.id as string).then((org: Organization) => {
                const {contactRoles ,...data} = org
                const contactsInOrg = contactRoles.map((d: {jobTitle:string, contact: any; }) => ({
                    ...d.contact,
                    jobTitle: d.jobTitle
                }))
                // @ts-ignore
                setOrganization(data);
                setContactInOrganization(contactsInOrg)
                setLoading(false)
                setReloadDetails(false)
            }).catch(() => {
                setLoading(false)
                setReloadDetails(false)
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }
    }, [router.query.id, reloadDetails]);


    if (organization === null && !loading && !createMode) {
        return <FullScreenModeLayout fullScreenMode >
                <div className="flex flex-column align-items-center justify-items-center">
                    <h1 >Error</h1>
                    <p className="text-lg">
                        This page crashed due to unexpected error, this should not happen but our team is
                        working hard to solve it.
                    </p>
                    <p className="mb-6 text-lg">
                        Meanwhile you can reload the page or navigate back to dashboard
                    </p>
                    <Button className="mt-6"
                        mode="primary" onClick={()=> router.push("/")}>
                     Go back to dashboard
                    </Button>
             </div>
        </FullScreenModeLayout>
    }

    return (
        <FullScreenModeLayout fullScreenMode>
            <div className={styles.grid}>
                <article className={styles.details}>
                    {loading ? (
                        <div className="p-3">
                            <Skeleton className="mb-3"/>
                            <Skeleton className="mb-3"/>
                            <Skeleton className="mb-3"/>
                            <Skeleton className="mb-3"/>
                            <Skeleton className="mb-3"/>
                        </div>
                    ) : (
                        <EditOrganization
                            createMode={createMode}
                            organisation={organization as any}
                            onReload={() => setReloadDetails(true)}
                        />
                    )}
                </article>

                {!createMode && (
                <>
                    <article className={styles.contactList}>
                        {loading ? (
                            <div className="p-3">
                                <Skeleton className="mb-3"/>
                                <Skeleton className="mb-3"/>
                                <Skeleton className="mb-3"/>
                                <Skeleton className="mb-3"/>
                                <Skeleton className="mb-3"/>
                            </div>
                        ) : (
                            <>
                                <CardHeading>  Contacts </CardHeading>
                                <OrganizationContactList contacts={contactInOrganisation} />
                            </>
                        )}

                    </article>

                    {/*<section className={styles.composeBox}>*/}
                    {/*    <Editor*/}
                    {/*        // style={{height: '120px'}}*/}
                    {/*        className="w-full h-full"*/}
                    {/*        headerTemplate={<RichTextHeader*/}
                    {/*            inputRef={null}*/}
                    {/*            handleFileChange={() => null}*/}
                    {/*            handleUploadClick={() => null}*/}
                    {/*        />}*/}
                    {/*        value={''}*/}
                    {/*        onTextChange={(e) => setValue('htmlEnhanced', e?.htmlValue)}*/}
                    {/*    />*/}
                    {/*</section>*/}

                    <article className={styles.history}>
                        {loading ? (
                            <div className="p-3">
                                <Skeleton className="mb-3"/>
                                <Skeleton className="mb-3"/>
                                <Skeleton className="mb-3"/>
                                <Skeleton className="mb-3"/>
                                <Skeleton className="mb-3"/>
                            </div>
                        ) : (
                            <>
                                <CardHeading> Timeline </CardHeading>
                                <OrganizationHistory  contacts={contactInOrganisation}/>
                            </>

                        )}
                    </article>
                </>
                    )}


            </div>

        </FullScreenModeLayout>
    );
}

export default OrganizationEdit