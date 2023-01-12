import React, { useState } from 'react';
import {WorkspaceList, WorkspacesList} from "../../molecules";
import {AvatarButton, WorkspaceButton, WorkspaceElementButton} from "../../atoms";
import styles from './menu-panel.module.css'
import {useSession} from "next-auth/react";

interface Props {
    workspaceList: string[];
    workspaceListItems?: string[];
}

const SidePanel: React.FC<Props> = ({ workspaceList, workspaceListItems = ['data'] }) => {
    const [isWorkspaceListItemsVisible, setIsWorkspaceListItemsVisible] = useState(false);
    const {data: session} = useSession();

    console.log(isWorkspaceListItemsVisible)

    return (
        <div>
            <AvatarButton image={null}
                          onClick={() => setIsWorkspaceListItemsVisible(!isWorkspaceListItemsVisible)} />
        <div className={styles.panel}>
                <span>{session?.user?.name}</span>
        </div>
            </div>
    );
};

export default SidePanel;