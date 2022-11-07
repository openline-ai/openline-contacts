import LayoutMenu from "./menu";
import {useRouter} from "next/router";
import {Button} from "primereact/button";

export default function Layout({children}: any) {
    const router = useRouter();

    return (
        <div className="flex h-full w-full">

            <div className="flex flex-column flex-grow-0 h-full text-white"
                 style={{width: '200px', background: '#100024'}}>

                <div className="flex flex-row align-items-center">

                    {/*<div className='eclipse flex ml-2'>MB</div>*/}
                    <div className="flex-grow-1 ml-3">Millie Brown</div>

                    <Button className="p-button-text p-button-secondary text-white">
                        <i className="pi pi-bell"></i>
                    </Button>

                </div>

                <div className="flex w-full">
                    <LayoutMenu/>
                </div>

            </div>

            <div className="flex-grow-1 flex h-full">
                <div className="w-full h-full">
                    {children}
                </div>
            </div>
        </div>
    )
}