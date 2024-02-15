//React
import * as React from "react";

//UI Styles
import {
    ActionButton,
    DatePicker,
    DirectionalHint,
    Dropdown,
    Icon,
    IconButton,
    IDropdownOption,
    IIconProps,
    ITooltipHostStyles,
    Label,
    PrimaryButton,
    ProgressIndicator,
    Stack,
    TextField,
    Toggle,
    TooltipHost,
} from "@fluentui/react";

//Components
import { NetworkCompany } from "../../../types/NetworkCompany";
import { Source } from "../../../types/Source";

import getErrorMessage from "../../../Other/InputValidation";
import {
    HiddenLabel,
    StyledDiv,
    TextOverflow,
} from "../../Admin/PurchaseOrderPage/PurchaseOrderStyles";
import {
    ContainerDiv,
    HiddenInput,
    StyledFontIcon,
} from "../../../components/common/FileInput";
import { useCallback, useState } from "react";
import {
    DeleteSupportDocument,
    DownloadSupportDocument,
} from "../../../services/assetService";
import { useBoolean } from "@fluentui/react-hooks";
import SytledDialog from "../../../components/common/StyledDialog";
import {
    convertDateToddMMMYYYFormat,
    convertUTCDateToLocalDate,
} from "../../../Other/DateFormat";
import StyledLabel from "../../../components/common/StyledLabel";
import { clearIconStyle } from "./OtherSourceDashboardStyles";

const inlineInputStyle = {
    root: {
        label: {
            whiteSpace: "nowrap",
            padding: "5px 0px 5px 0",
            lineHeight: 22,
            fontSize: 16,
        },
        lineHeight: "22px",
    },
    fieldGroup: { marginLeft: 10, width: "80%" },
    wrapper: { display: "flex" },
};

const hostStyles: Partial<ITooltipHostStyles> = {
    root: { display: "inline-block" },
};

const infoIcon: IIconProps = { iconName: "Info" };

interface IModalHeaderProps {
    isReadOnly: boolean;
    sources?: IDropdownOption<Source>[] | null;
    networkCompanies?: IDropdownOption<NetworkCompany> | null;
    selectedNetworkCompany?: string;
    selectedSource?: string;
    receivedDate: Date;
    notes: string;
    otherSourceId: string | undefined;
    documentFileName: string;
    filePath: string;
    showLineErrorMessage: boolean;
    setFailure: React.Dispatch<React.SetStateAction<string | undefined>>;
    addRequest: () => void;
    toggleFileChange: () => void;
    setSelectedNetworkCompany: React.Dispatch<
        React.SetStateAction<string | undefined>
    >;
    setSelectedSource: React.Dispatch<React.SetStateAction<string | undefined>>;
    setReceivedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    setDocumentFileName: React.Dispatch<
        React.SetStateAction<string | undefined>
    >;
    setDocumentFile: React.Dispatch<
        React.SetStateAction<Blob | undefined | null>
    >;
    setFilePath: React.Dispatch<React.SetStateAction<string | undefined>>;
    setNotes: React.Dispatch<React.SetStateAction<string | undefined>>;
    isExistingAsset: boolean;
    toggleIsExistingAsset: () => void;
    documentNumber: string | undefined;
    setDocumentNumber: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ModalHeader: React.FC<IModalHeaderProps> = (props: any) => {
    const {
        sources,
        isReadOnly,
        networkCompanies,
        otherSourceId,
        selectedNetworkCompany,
        setSelectedNetworkCompany,
        selectedSource,
        documentFileName,
        setSelectedSource,
        notes,
        setNotes,
        receivedDate,
        setReceivedDate,
        setDocumentFileName,
        filePath,
        setFilePath,
        setFailure,
        showLineErrorMessage,
        setDocumentFile,
        addRequest,
        toggleFileChange,
        isExistingAsset,
        toggleIsExistingAsset,
        documentNumber,
        setDocumentNumber,
    } = props;

    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [showDeleteDialog, { toggle: toggleDeleteDialog }] =
        useBoolean(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [
        existingAssetChangeDialog,
        { toggle: toggleExistingAssetChangeDialog },
    ] = useBoolean(false);
    const downloadHandler = useCallback(async () => {
        setIsDownloading(true);
        if (otherSourceId !== undefined) {
            try {
                await DownloadSupportDocument(otherSourceId, documentFileName);
                setIsDownloading(false);
            } catch (err: any) {
                setFailure(err);
            }
        }
    }, [otherSourceId, documentFileName, setFailure]);

    const deleteSupportDocument = useCallback(async () => {
        if (otherSourceId !== undefined) {
            !existingAssetChangeDialog && toggleDeleteDialog();
            setIsDeleting(true);
            try {
                var deleteFile = await DeleteSupportDocument(otherSourceId);
                if (deleteFile) {
                    setIsDeleting(false);
                    setDocumentFile(undefined);
                }
            } catch (err: any) {
                setFailure(err);
            }
            setIsDeleting(false);
            setDocumentFile(null);
            setDocumentFileName(null);
            if (existingAssetChangeDialog) {
                setDocumentNumber(undefined);
            }
            setFilePath(null);
        }
    }, [
        otherSourceId,
        toggleDeleteDialog,
        existingAssetChangeDialog,
        setDocumentNumber,
    ]);

    React.useEffect(() => {
        if (isExistingAsset) {
            if (documentNumber && documentFileName) {
                toggleExistingAssetChangeDialog();
            }
        }
    }, [documentFileName, documentNumber, isExistingAsset]);

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
    }, [showDeleteDialog, toggleDeleteDialog, deleteSupportDocument]);

    if (isReadOnly) {
        return (
            <>
                <ContainerDiv style={{ margin: "16px" }}>
                    <Toggle
                        label="Adding existing / missed assets"
                        defaultChecked={isExistingAsset ?? false}
                        onText="Yes"
                        offText="No"
                        disabled
                    />
                </ContainerDiv>
                <Stack
                    horizontal
                    wrap
                    tokens={{ childrenGap: 20 }}
                    style={{ margin: "16px" }}
                >
                    <Stack style={{ width: "40%" }}>
                        <TextField
                            label="Network Company: "
                            borderless
                            readOnly
                            value={selectedNetworkCompany}
                            styles={inlineInputStyle}
                        />
                        <TextField
                            label="Source: "
                            borderless
                            readOnly
                            value={selectedSource}
                            styles={inlineInputStyle}
                        />
                        <TextField
                            label={
                                isExistingAsset ? "Added on: " : "Received On: "
                            }
                            borderless
                            readOnly
                            value={
                                isExistingAsset
                                    ? convertDateToddMMMYYYFormat(new Date())
                                    : convertDateToddMMMYYYFormat(
                                          convertUTCDateToLocalDate(
                                              receivedDate
                                          )
                                      )
                            }
                            styles={inlineInputStyle}
                        />
                    </Stack>
                    <Stack style={{ width: "40%" }}>
                        {!isExistingAsset ? (
                            <>
                                <TooltipHost content={documentNumber ?? ""}>
                                    <TextField
                                        label="Document Number: "
                                        borderless
                                        readOnly
                                        styles={inlineInputStyle}
                                        defaultValue={documentNumber ?? ""}
                                    />
                                </TooltipHost>
                                <Stack horizontal>
                                    <Stack style={{ float: "left" }}>
                                        <Label style={{ fontSize: "15px" }}>
                                            Supporting Document:
                                        </Label>
                                    </Stack>
                                    <Stack style={{ width: "10%" }}>
                                        {isDownloading ? (
                                            <ProgressIndicator
                                                label={"Downloading"}
                                                description="Please wait"
                                            />
                                        ) : (
                                            <Stack
                                                horizontal
                                                tokens={{ childrenGap: 10 }}
                                            >
                                                <IconButton
                                                    iconProps={{
                                                        iconName: "Download",
                                                        style: {
                                                            color: "black",
                                                        },
                                                    }}
                                                    onClick={downloadHandler}
                                                />
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>
                            </>
                        ) : null}

                        <TextField
                            label="Notes: "
                            borderless
                            readOnly
                            value={notes}
                            styles={inlineInputStyle}
                            multiline
                            rows={3}
                        />
                    </Stack>
                </Stack>
            </>
        );
    } else
        return (
            <>
                <DeleteDialog />
                <ContainerDiv style={{ margin: "16px" }}>
                    <Toggle
                        label="Are you adding existing / missed assets"
                        defaultChecked={isExistingAsset ?? false}
                        checked={isExistingAsset}
                        onText="Yes"
                        offText="No"
                        onChange={toggleIsExistingAsset}
                    />
                </ContainerDiv>
                <Stack
                    horizontal
                    horizontalAlign="space-between"
                    wrap
                    style={{ margin: "16px" }}
                >
                    <Stack style={{ width: 200 }}>
                        <Dropdown
                            placeholder="Select Network Company"
                            required
                            label="Network Company"
                            options={networkCompanies}
                            selectedKey={selectedNetworkCompany}
                            onChange={(e, item) =>
                                setSelectedNetworkCompany(item?.key)
                            }
                            errorMessage={
                                showLineErrorMessage &&
                                getErrorMessage(selectedNetworkCompany)
                            }
                        />
                        <Dropdown
                            placeholder="Select Source"
                            required={isExistingAsset ? false : true}
                            label="Source"
                            selectedKey={selectedSource}
                            options={sources}
                            onChange={(e, item) => setSelectedSource(item?.key)}
                            errorMessage={
                                showLineErrorMessage &&
                                !isExistingAsset &&
                                getErrorMessage(selectedSource)
                            }
                            disabled={isReadOnly}
                            onRenderCaretDown={(props) => (
                                <Stack horizontal>
                                    {isExistingAsset && selectedSource ? (
                                        <ActionButton
                                            iconProps={{ iconName: "Clear" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedSource(null);
                                            }}
                                            styles={clearIconStyle}
                                            disabled={isReadOnly}
                                        />
                                    ) : null}
                                    <Icon iconName="ChevronDown" />
                                </Stack>
                            )}
                        />
                        {!isExistingAsset ? (
                            <Stack>
                                <StyledLabel
                                    text="Received On"
                                    isMandatory={true}
                                ></StyledLabel>
                                <DatePicker
                                    placeholder="Received Date"
                                    value={
                                        receivedDate &&
                                        convertUTCDateToLocalDate(
                                            new Date(receivedDate)
                                        )
                                    }
                                    maxDate={new Date(Date.now())}
                                    onSelectDate={(
                                        date: Date | null | undefined
                                    ) => setReceivedDate(date)}
                                    disabled={isReadOnly}
                                />
                            </Stack>
                        ) : (
                            <Stack>
                                <StyledLabel
                                    text="Added On"
                                    isMandatory={true}
                                ></StyledLabel>
                                <DatePicker
                                    placeholder="Received Date"
                                    defaultValue={
                                        isExistingAsset
                                            ? receivedDate
                                            : new Date().toLocaleDateString()
                                    }
                                    value={new Date()}
                                    maxDate={new Date(Date.now())}
                                    minDate={new Date(Date.now())}
                                    disabled={isReadOnly}
                                />
                            </Stack>
                        )}
                    </Stack>
                    <Stack style={{ width: "30%" }}>
                        {!isExistingAsset ? (
                            <>
                                <ContainerDiv style={{ width: 200 }}>
                                    <TextField
                                        placeholder="Document Number"
                                        label="Document Number"
                                        resizable={false}
                                        required
                                        onChange={(
                                            e,
                                            value: string | undefined
                                        ) => {
                                            setDocumentNumber(value);
                                        }}
                                        defaultValue={documentNumber ?? ""}
                                        errorMessage={
                                            documentNumber &&
                                            documentNumber.length > 50
                                                ? "Document Number exceeds character limit"
                                                : undefined
                                        }
                                        validateOnLoad={false}
                                        validateOnFocusOut
                                    />
                                </ContainerDiv>
                                <div>
                                    <Stack>
                                        <Stack style={{ float: "left" }}>
                                            <Label>
                                                Supporting Document
                                                <span
                                                    style={{
                                                        color: "darkred",
                                                        paddingLeft: "3px",
                                                    }}
                                                >
                                                    {" "}
                                                    *
                                                </span>
                                            </Label>
                                        </Stack>
                                        <Stack style={{ width: "100%" }}>
                                            {isDownloading || isDeleting ? (
                                                <ProgressIndicator
                                                    label={
                                                        isDeleting
                                                            ? "Deleting"
                                                            : "Downloading"
                                                    }
                                                    description="Please wait"
                                                />
                                            ) : filePath &&
                                              filePath.length > 0 ? (
                                                <Stack
                                                    horizontal
                                                    tokens={{ childrenGap: 10 }}
                                                >
                                                    <IconButton
                                                        iconProps={{
                                                            iconName:
                                                                "Download",
                                                            style: {
                                                                color: "black",
                                                            },
                                                        }}
                                                        onClick={
                                                            downloadHandler
                                                        }
                                                    />
                                                    <IconButton
                                                        iconProps={{
                                                            iconName: "Delete",
                                                            style: {
                                                                color: "red",
                                                            },
                                                        }}
                                                        onClick={
                                                            toggleDeleteDialog
                                                        }
                                                    />
                                                </Stack>
                                            ) : (
                                                <>
                                                    <HiddenLabel>
                                                        <HiddenInput
                                                            accept=".eml,.pdf,.jpeg,.jpg,.png"
                                                            type="file"
                                                            onChange={(
                                                                e: React.ChangeEvent<HTMLInputElement>
                                                            ) => {
                                                                if (
                                                                    e
                                                                        .currentTarget
                                                                        .files &&
                                                                    e
                                                                        .currentTarget
                                                                        .files
                                                                        .length >
                                                                        0
                                                                ) {
                                                                    const allowedFileTypes =
                                                                        [
                                                                            "eml",
                                                                            "pdf",
                                                                            "jpeg",
                                                                            "jpg",
                                                                            "png",
                                                                        ];
                                                                    const selectedFileType =
                                                                        e.currentTarget.files[0].name
                                                                            .split(
                                                                                "."
                                                                            )
                                                                            .pop()
                                                                            ?.toLowerCase();

                                                                    if (
                                                                        selectedFileType &&
                                                                        allowedFileTypes.includes(
                                                                            selectedFileType
                                                                        )
                                                                    ) {
                                                                        setDocumentFileName(
                                                                            e
                                                                                .currentTarget
                                                                                .files[0]
                                                                                .name
                                                                        );
                                                                        setDocumentFile(
                                                                            e
                                                                                .currentTarget
                                                                                .files[0]
                                                                        );
                                                                        toggleFileChange();
                                                                    } else {
                                                                        setFailure(
                                                                            "Please select a valid file type: .eml, .pdf, .jpeg, .jpg, or .png"
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <ContainerDiv>
                                                            <StyledDiv>
                                                                <TextOverflow
                                                                    title={
                                                                        documentFileName
                                                                    }
                                                                >
                                                                    {
                                                                        documentFileName
                                                                    }
                                                                </TextOverflow>
                                                                <StyledFontIcon
                                                                    aria-label="Upload"
                                                                    iconName="Upload"
                                                                />
                                                            </StyledDiv>
                                                            <TooltipHost
                                                                directionalHint={
                                                                    DirectionalHint.topLeftEdge
                                                                }
                                                                content={
                                                                    "File types : eml, pdf, jpeg, jpg, png"
                                                                }
                                                                styles={
                                                                    hostStyles
                                                                }
                                                            >
                                                                <IconButton
                                                                    iconProps={
                                                                        infoIcon
                                                                    }
                                                                />
                                                            </TooltipHost>
                                                        </ContainerDiv>
                                                    </HiddenLabel>
                                                </>
                                            )}
                                        </Stack>
                                    </Stack>
                                </div>
                            </>
                        ) : null}
                        <Stack
                            styles={{
                                root: {
                                    marginTop: "auto",
                                },
                            }}
                        >
                            <TextField
                                label="Notes"
                                maxLength={2500}
                                onChange={(e, value: string | undefined) => {
                                    setNotes(value);
                                }}
                                defaultValue={notes}
                                disabled={isReadOnly}
                                multiline
                                rows={3}
                            />
                        </Stack>
                    </Stack>
                    <Stack.Item align="end">
                        <PrimaryButton
                            text="+ Add Assets"
                            onClick={() => addRequest()}
                            disabled={isReadOnly}
                        />
                    </Stack.Item>
                </Stack>

                <SytledDialog
                    showDialog={existingAssetChangeDialog}
                    toggleDialog={toggleExistingAssetChangeDialog}
                    title="Existing asset change Confirmation"
                    subText={
                        "Changing this will delete document number and uploaded document. do you want to continue."
                    }
                    action={() => {
                        toggleExistingAssetChangeDialog();
                        deleteSupportDocument();
                    }}
                    noAction={() => {
                        toggleExistingAssetChangeDialog();
                        toggleIsExistingAsset();
                    }}
                />
            </>
        );
};

export default ModalHeader;
