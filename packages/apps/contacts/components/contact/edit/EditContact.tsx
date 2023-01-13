import {FullScreenModeLayout} from "../../organisms/fullscreen-mode-layout";
import styles from './edit-contact.module.scss'
import {DetailsPageLayout} from "../details-page-layout/DetailsPageLayout";
export function EditContact() {

    // const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
    // const deleteContact = () => {
    //     DeleteContact(client, id).then((result: boolean) => {
    //         if (result) {
    //             router.push('/contact');
    //             toast.success("Contact removed successfully!");
    //         } else {
    //             //todo log an error in server side
    //             toast.error("There was a problem on our side and we are doing our best to solve it!");
    //         }
    //     }).catch((reason: any) => {
    //         toast.error("There was a problem on our side and we are doing our best to solve it!");
    //     });
    // }


    return (

        <FullScreenModeLayout fullScreenMode classNames={styles.editContactPage}>
            <DetailsPageLayout />
        </FullScreenModeLayout>

    );
}

