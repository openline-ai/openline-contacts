import React, {ReactNode, useState} from 'react';
import {AvatarButton, Divider, WorkspaceButton} from "../../atoms";
import icon from "../../../public/favicon.ico";
import styles from './workspaces-list.module.css'
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronCircleRight, faUser} from "@fortawesome/free-solid-svg-icons";
import {useSession} from "next-auth/react";
interface Props {
    children: ReactNode;
}
// fixme
export const WorkspacesList: React.FC<Props> = ({ children }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const {data: session} = useSession();

    return (
        <div className={styles.workspaces}>
            <div className={styles.workspacesList}>
                <AvatarButton image={null} ariaLabel='Profile' onClick={() => setDropdownVisible(!dropdownVisible)} />
                 <Divider />
                {children}
            </div>
        </div>
    );
};

