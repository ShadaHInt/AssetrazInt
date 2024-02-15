import {
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    PrimaryButton,
    hiddenContentStyle,
    mergeStyles,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { FC, useMemo } from "react";

const dialogStyles = { main: { maxWidth: 450 } };
const screenReaderOnly = mergeStyles(hiddenContentStyle);

interface IDialogProps {
    title: string;
    showDialog: boolean;
    subText: string;
    toggleDialog: () => void;
    action: () => void;
    noAction?: () => void;
}

const SytledDialog: FC<IDialogProps> = (props) => {
    const { title, showDialog, subText, toggleDialog, action, noAction } =
        props;
    const labelId: string = useId("dialogLabel");
    const subTextId: string = useId("subTextLabel");

    const dialogContentProps = {
        type: DialogType.normal,
        title: title,
        closeButtonAriaLabel: "Close",
        subText: subText,
    };

    const modalProps = useMemo(
        () => ({
            titleAriaId: labelId,
            subtitleAriaId: subTextId,
            isBlocking: true,
            styles: dialogStyles,
        }),
        [labelId, subTextId]
    );

    return (
        <>
            <label id={labelId} className={screenReaderOnly}>
                hidden
            </label>
            <label id={subTextId} className={screenReaderOnly}>
                hidden
            </label>
            <Dialog
                hidden={!showDialog}
                onDismiss={toggleDialog}
                dialogContentProps={dialogContentProps}
                modalProps={modalProps}
            >
                <DialogFooter>
                    <PrimaryButton onClick={action} text="Yes" />
                    <DefaultButton
                        onClick={noAction ? noAction : toggleDialog}
                        text="No"
                    />
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default SytledDialog;
