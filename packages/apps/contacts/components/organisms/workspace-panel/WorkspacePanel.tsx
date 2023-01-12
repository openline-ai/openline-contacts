import React, { useState } from 'react';
import {WorkspaceList, WorkspacesList} from "../../molecules";
import {WorkspaceButton, WorkspaceElementButton} from "../../atoms";
import styles from './workspace-panel.module.css'

interface Props {
    workspaceList: string[];
    workspaceListItems?: string[];
}

const SidePanel: React.FC<Props> = ({ workspaceList, workspaceListItems = ['data'] }) => {
    const [isWorkspaceListItemsVisible, setIsWorkspaceListItemsVisible] = useState(false);


    return (
        <div className={styles.panel}>
            <WorkspacesList>
                {workspaceList.map((item, index) => (
                    <WorkspaceButton
                        key={item}
                        label={item}
                        onClick={() => {
                            setIsWorkspaceListItemsVisible(!isWorkspaceListItemsVisible);
                        }}
                    />
                ))}
            </WorkspacesList>
        </div>
    );
};

export default SidePanel;