import {useRouter} from "next/router";
import {Menu} from "primereact/menu";


const LayoutMenu = () => {
    const router = useRouter();

    let items = [
        {
            label: 'Customers', icon: 'pi pi-mobile', command: () => {
                router.push('/customer');
            }
        },
        {
            label: 'Contacts', icon: 'pi pi-mobile', command: () => {
                router.push('/contact');
            }
        }
    ];

    return (
        <Menu model={items}/>
    );
}

export default LayoutMenu
