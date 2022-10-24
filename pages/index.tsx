import type {NextPage} from 'next'
import {useState} from "react";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import Layout from "../layout/layout";
import {InputText} from "primereact/inputtext";

const Home: NextPage = () => {
    const [aa, setAa] = useState(false);

    return (
        <>
            <Layout>

                <Dialog visible={aa} onHide={() => setAa(false)}>
                    // content
                </Dialog>

                <Button label="Show" onClick={() => setAa(true)}/>

                <InputText/>

            </Layout>

        </>
    )
}

export default Home
