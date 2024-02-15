import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
    PrimaryButton,
    Stack,
    TextField,
    Text,
    Toggle,
    mergeStyleSets,
} from "@fluentui/react";
import SytledDialog from "../../../components/common/StyledDialog";
import {
    IOtherSourceModalContext,
    useOtherSourceModalContext,
} from "../../../Contexts/OtherSourceModalContext";
import { useBoolean } from "@fluentui/react-hooks";
import { ContainerDiv } from "../../../components/common/FileInput";

import DropdownComponent, {
    FileUploadComponent,
    OtherSourceDatePicker,
} from "./OtherSourceModalComponents";
import { inlineInputStyle } from "./OtherSourceInventoryModalRefactored";
import { DeleteSupportDocument } from "../../../services/assetService";

const componentStyle = mergeStyleSets({
    root: {
        textAlign: "center",
    },
});

interface OtherSourceHeaderRefactoredProps {
    isReadOnly: boolean;
    children: React.ReactNode;
    otherSourceId?: string | undefined;
    isExistingAsset: boolean;
    toggleIsExistingAsset: () => void;
    setIsFileChange: React.Dispatch<React.SetStateAction<boolean>>;
    setFailure: React.Dispatch<React.SetStateAction<string | undefined>>;
    submitData: (
        register?: boolean,
        needsCloseRefresh?: boolean
    ) => Promise<void>;
    fetchData: () => void;
}

const OtherSourceHeaderRefactored: React.FC<
    OtherSourceHeaderRefactoredProps
> = ({
    isReadOnly,
    children,
    otherSourceId,
    isExistingAsset,
    toggleIsExistingAsset,
    setIsFileChange,
    setFailure,
    submitData,
    fetchData,
}) => {
    const { otherSourceDetail, setOtherSourceDetail } =
        useOtherSourceModalContext() as IOtherSourceModalContext;

    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [
        existingAssetChangeDialog,
        { toggle: toggleExistingAssetChangeDialog },
    ] = useBoolean(false);

    const [showDeleteDialog, { toggle: toggleDeleteDialog }] =
        useBoolean(false);

    const deleteSupportDocument = useCallback(async () => {
        if (otherSourceId !== undefined) {
            !existingAssetChangeDialog && toggleDeleteDialog();
            setIsDeleting(true);
            try {
                var deleteFile = await DeleteSupportDocument(otherSourceId);
                if (deleteFile) {
                    setIsDeleting(false);
                    const updatedRequest = [...otherSourceDetail!];
                    updatedRequest[0].fileName = undefined;
                    updatedRequest[0].supportingDocumentFile = undefined;
                    updatedRequest[0].supportingDocumentFilePath = undefined;
                    if (isExistingAsset) {
                        updatedRequest[0].documentNumber = undefined;
                        updatedRequest.map((item) => ({
                            ...item,
                            cutoverAsset: true,
                        }));
                    }
                    setOtherSourceDetail(updatedRequest);
                    if (isExistingAsset) {
                        submitData(false, false)
                            .then((submitDataResult: any) => {
                                return fetchData();
                            })
                            .then((fetchDataResult: any) => {})
                            .catch((error: any) => {
                                setFailure(error as string);
                            });
                    }
                }
            } catch (err: any) {
                setFailure(err as string);
            }
            setIsDeleting(false);
        }
    }, [
        existingAssetChangeDialog,
        fetchData,
        isExistingAsset,
        otherSourceDetail,
        otherSourceId,
        setFailure,
        setOtherSourceDetail,
        submitData,
        toggleDeleteDialog,
    ]);

    const DeleteDialog = useCallback(() => {
        return (
            <SytledDialog
                showDialog={showDeleteDialog}
                toggleDialog={toggleDeleteDialog}
                title="Delete Support Document"
                subText="Are you sure you want to delete?"
                action={deleteSupportDocument}
            />
        );
    }, [deleteSupportDocument, showDeleteDialog, toggleDeleteDialog]);

    const notesHandler = (
        e: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        value: string | undefined
    ) => {
        if (!otherSourceDetail) {
            setOtherSourceDetail([
                {
                    notes: value,
                },
            ]);
            return;
        } else {
            const updatedRequest = [...otherSourceDetail];
            updatedRequest[0].notes = value;
            setOtherSourceDetail(updatedRequest);
            return;
        }
    };

    useEffect(() => {
        if (isExistingAsset && otherSourceDetail?.[0]?.fileName) {
            toggleExistingAssetChangeDialog();
        }
    }, [isExistingAsset, otherSourceDetail, toggleExistingAssetChangeDialog]);

    const addRequest = () => {
        setOtherSourceDetail((prevState: any) => [...prevState, {}]);
    };

    return (
        <>
            <DeleteDialog />
            <SytledDialog
                showDialog={existingAssetChangeDialog}
                toggleDialog={() => {
                    toggleIsExistingAsset();
                    toggleExistingAssetChangeDialog();
                }}
                title="Existing asset change Confirmation"
                subText={
                    "Changing this will delete document number and uploaded document. Do you want to continue."
                }
                action={() => {
                    toggleExistingAssetChangeDialog();
                    deleteSupportDocument();
                }}
                noAction={() => {
                    toggleExistingAssetChangeDialog();
                    const updatedRequest = [...otherSourceDetail!];
                    const newValue = !updatedRequest[0].cutOverStock;

                    updatedRequest.forEach((item) => {
                        item.cutOverStock =
                            newValue === undefined ? false : newValue;
                    });
                    toggleIsExistingAsset();
                }}
            />
            <ContainerDiv style={{ margin: "16px" }}>
                <Toggle
                    label="Are you adding existing / missed assets"
                    checked={otherSourceDetail?.some(
                        (i) => i.cutOverStock === true
                    )}
                    onText="Yes"
                    offText="No"
                    onChange={() => {
                        const updatedRequest = [...otherSourceDetail!];
                        const newValue = !updatedRequest[0].cutOverStock;

                        updatedRequest.forEach((item) => {
                            item.cutOverStock =
                                newValue === undefined ? false : newValue;
                        });

                        toggleIsExistingAsset();
                    }}
                    disabled={isReadOnly}
                />
            </ContainerDiv>
            <Stack
                horizontal
                horizontalAlign="space-between"
                wrap
                style={{ margin: "16px" }}
            >
                <Stack style={{ width: isReadOnly ? "40%" : 200 }}>
                    <DropdownComponent
                        isReadOnly={isReadOnly}
                        isExistingAsset={isExistingAsset}
                    />
                    <OtherSourceDatePicker
                        isReadOnly={isReadOnly}
                        isExistingAsset={isExistingAsset}
                    />
                </Stack>

                <Stack
                    style={{
                        width: isReadOnly ? "40%" : "30%",
                        height: isReadOnly ? "20vh" : "30vh",
                    }}
                >
                    <FileUploadComponent
                        otherSourceId={otherSourceId}
                        isExistingAsset={isExistingAsset}
                        isReadOnly={isReadOnly}
                        isDeleting={isDeleting}
                        setIsFileChange={setIsFileChange}
                        toggleDeleteDialog={toggleDeleteDialog}
                        setFailure={setFailure}
                    >
                        {children}
                    </FileUploadComponent>

                    <Stack
                        styles={{
                            root: {
                                marginTop: "auto",
                            },
                        }}
                    >
                        {isReadOnly ? (
                            <TextField
                                label="Notes: "
                                borderless
                                readOnly
                                value={otherSourceDetail?.[0]?.notes}
                                styles={inlineInputStyle}
                                multiline
                                rows={3}
                            />
                        ) : (
                            <TextField
                                label="Notes"
                                maxLength={2500}
                                onChange={notesHandler}
                                value={otherSourceDetail?.[0]?.notes}
                                disabled={isReadOnly}
                                multiline
                                rows={3}
                            />
                        )}
                    </Stack>
                </Stack>

                <Stack verticalAlign="end" style={{ marginBottom: "5px" }}>
                    <Text variant="mediumPlus" className={componentStyle.root}>
                        Asset count : {otherSourceDetail?.length}
                    </Text>
                </Stack>
                <Stack.Item align="end">
                    {!isReadOnly && (
                        <PrimaryButton
                            text="+ Add Assets"
                            onClick={() => addRequest()}
                        />
                    )}
                </Stack.Item>
            </Stack>
        </>
    );
};

export default React.memo(OtherSourceHeaderRefactored);
