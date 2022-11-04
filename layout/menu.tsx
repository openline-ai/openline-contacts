import {useRouter} from "next/router";
import {Menu} from "primereact/menu";


const LayoutMenu = () => {
    const router = useRouter();

    let items = [

        {
            label: 'Contacts', icon: 'pi pi-mobile', command: () => {
                router.push('/contact');
            }
        },
        {
            label: 'Contact groups', icon: 'pi pi-mobile', command: () => {
                router.push('/contactGroup');
            }
        }
    ];

    return (
        <Menu model={items}/>
    );
}

export default LayoutMenu
