import LayoutMenu from "./menu";
import {useRouter} from "next/router";

export default function Layout({children}: any) {
    const router = useRouter();

    return (
            <div className="flex h-full w-full">

                <div className="flex-grow-0 flex h-full" style={{width: '200px'}}>

                    <LayoutMenu/>

                </div>

                <div className="flex-grow-1 flex h-full">
                    <div className="w-full h-full">
                        {children}
                    </div>
                </div>
            </div>
    )
}