import React, {ButtonHTMLAttributes, EventHandler, FC, ReactNode} from 'react';
import styles from "./delete-confirmation-dialog.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {Dialog} from "primereact/dialog";
import {Button} from "../button";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    deleteConfirmationModalVisible: boolean
    setDeleteConfirmationModalVisible: (newState: boolean) => void
    deleteAction: () => void
    header?: string
    confirmationButtonLabel?: string
    explanationText?: string | ReactNode
}

export const DeleteConfirmationDialog: FC<Props> = (
    {
        setDeleteConfirmationModalVisible,
        deleteConfirmationModalVisible,
        deleteAction,
        header,
        confirmationButtonLabel,
        explanationText
    }) => {
    return (

        <Dialog header={header || 'Confirm Delete'}
                draggable={false}
                visible={deleteConfirmationModalVisible}
                footer={
                    <div className="flex flex-grow-1 justify-content-between align-items-center">
                        <Button
                            onClick={() => setDeleteConfirmationModalVisible(false)}
                            className="p-button-text">
                            <FontAwesomeIcon icon={faTimes} className="mr-2"/>
                            Cancel
                        </Button>
                        <Button
                            style={{marginRight: '0'}}
                            mode="danger"
                            onClick={deleteAction}
                            autoFocus
                        >
                            {confirmationButtonLabel || "Delete"}
                        </Button>
                    </div>
                }
                onHide={() => setDeleteConfirmationModalVisible(false)}>
            <p>{explanationText || "Are you sure you want to delete this item? This action cannot be undone."}</p>
        </Dialog>
    );
};