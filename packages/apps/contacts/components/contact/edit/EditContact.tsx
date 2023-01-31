import {FullScreenModeLayout} from "../../organisms/fullscreen-mode-layout";
import styles from './edit-contact.module.scss'
import {DetailsPageLayout} from "../details-page-layout/DetailsPageLayout";
export function EditContact() {

    return (

        <FullScreenModeLayout fullScreenMode classNames={styles.editContactPage}>
            <DetailsPageLayout />
        </FullScreenModeLayout>

    );
}

