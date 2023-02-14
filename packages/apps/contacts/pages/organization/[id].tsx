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
import CreateOrganizationNoteEditor from "../../components/organization/CreateOrganisationNoteEditor";
import {Contact} from "../../models/contact";

function OrganizationEdit() {
    const client = useGraphQLClient();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [refreshNotes, setRefreshNotes] = useState(true);
    const [organization, setOrganization] = useState(null);
    const [contactInOrganisation, setContactInOrganization] = useState<Array<Contact>>([]);
    const [reloadDetails, setReloadDetails] = useState(false);
    const [createMode, setCreateMode] = useState(false);


    useEffect(() => {
        if (router.query.id !== undefined && router.query.id === 'new') {
            setCreateMode(true);
            setLoading(false)
        }
    }, [router.query.id]);

    useEffect(() => {
        if (router.query.id !== undefined && router.query.id !== 'new') {
            setLoading(true)
            setCreateMode(false)
            GetOrganization(client, router.query.id as string,).then((org: Organization) => {
                const {contacts: {content}, ...data} = org
                // @ts-ignore
                setOrganization(data);
                setContactInOrganization(content)
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
        return <FullScreenModeLayout fullScreenMode>
            <div className="flex flex-column align-items-center justify-items-center">
                <h1>Error</h1>
                <p className="text-lg">
                    This page crashed due to unexpected error, this should not happen but our team is
                    working hard to solve it.
                </p>
                <p className="mb-6 text-lg">
                    Meanwhile you can reload the page or navigate back to dashboard
                </p>
                <Button className="mt-6"
                        mode="primary" onClick={() => router.push("/")}>
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
                                    <CardHeading><span style={{padding: '0px 24px'}}>Contacts</span></CardHeading>
                                    <OrganizationContactList contacts={contactInOrganisation}/>
                                </>
                            )}

                        </article>

                        <section className={styles.composeBox}>
                            <CreateOrganizationNoteEditor
                                organizationId={router.query.id as string}
                                notifyChanged={() => setRefreshNotes(true)}
                            />
                        </section>

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
                                <OrganizationHistory
                                    organizationId={router.query.id as string}
                                    contacts={contactInOrganisation}
                                    setRefreshNotes={setRefreshNotes}
                                    refreshNotes={refreshNotes}
                                />
                            )}
                        </article>
                    </>
                )}

            </div>

        </FullScreenModeLayout>
    );
}

export default OrganizationEdit