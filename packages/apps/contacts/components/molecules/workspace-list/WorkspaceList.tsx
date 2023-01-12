import React, {FC, useState} from 'react';
import {AvatarButton} from "../../atoms";
import styles from './workspace-list.module.css'

export const WorkspaceList: FC<{children: JSX.Element}> = ({ children }) => {

    return (
        <div className={styles.workspace}>
            {children}
            <div className="avatar-button">
                {/*<AvatarButton image="avatar.jpg" ariaLabel='Profile' onClick={() => setDropdownVisible(!dropdownVisible)} />*/}
                {/*<Dropdown*/}
                {/*    overlay={*/}
                {/*        <Menu>*/}
                {/*            <Menu.Item>My Profile</Menu.Item>*/}
                {/*            <Menu.Item>Log Out</Menu.Item>*/}
                {/*        </Menu>*/}
                {/*    }*/}
                {/*    visible={dropdownVisible}*/}
                {/*    onVisibleChange={setDropdownVisible}*/}
                {/*>*/}
                {/*    <div className="dropdown-placeholder" />*/}
                {/*</Dropdown>*/}
            </div>
        </div>
    );
};

