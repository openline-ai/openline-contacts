import {DetailsPageLayout} from "../../components/contact/details-page-layout/DetailsPageLayout";
import {FullScreenModeLayout} from "../../components/organisms/fullscreen-mode-layout";

function ContactDetails() {
    return (
        <FullScreenModeLayout fullScreenMode>
            <DetailsPageLayout/>
        </FullScreenModeLayout>
    );
}

export default ContactDetails