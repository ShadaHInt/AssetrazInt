import {
    ActionButton,
    DatePicker,
    DefaultButton,
    DirectionalHint,
    Dropdown,
    IDropdownOption,
    IIconProps,
    ITooltipHostStyles,
    Icon,
    IconButton,
    Label,
    PrimaryButton,
    ProgressIndicator,
    Stack,
    TextField,
    TooltipHost,
} from "@fluentui/react";
import {
    IFilterContext,
    useFilterContext,
} from "../../../Contexts/OtherSourceFilterContext";
import { Source } from "../../../types/Source";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { GetAllSources } from "../../../services/sourceService";

import { clearIconStyle } from "./OtherSourceDashboardStyles";
import StyledLabel from "../../../components/common/StyledLabel";
import DashboardStyle from "../../Home/DashboardStyles";
import {
    convertDateToddMMMYYYFormat,
    convertUTCDateToLocalDate,
} from "../../../Other/DateFormat";
import {
    IOtherSourceModalContext,
    useOtherSourceModalContext,
} from "../../../Contexts/OtherSourceModalContext";
import {
    ContainerDiv,
    HiddenInput,
    StyledFontIcon,
} from "../../../components/common/FileInput";
import {
    HiddenLabel,
    StyledDiv,
    TextOverflow,
} from "../../Admin/PurchaseOrderPage/PurchaseOrderStyles";
import { DownloadSupportDocument } from "../../../services/assetService";
import { OtherSourceInventoryProps } from "../../../types/OtherSourceInventory";

const infoIcon: IIconProps = { iconName: "Info" };
const hostStyles: Partial<ITooltipHostStyles> = {
    root: { display: "inline-block" },
};

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

interface DropdownComponentProps {
    isReadOnly?: boolean;
    isExistingAsset?: boolean;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
    isReadOnly,
    isExistingAsset,
}) => {
    const { otherSourceDetail, setOtherSourceDetail } =
        useOtherSourceModalContext() as IOtherSourceModalContext;
    const { networkCompanyOption: networkCompanies } =
        useFilterContext() as IFilterContext;
    const [sources, setSources] = useState<IDropdownOption<Source>[] | null>();

    useEffect(() => {
        const getSources = async () => {
            await GetAllSources()
                .then((res) => setSources(res))
                .catch((err) => setSources(null));
        };
        getSources();
    }, []);

    const clearSource = useCallback(() => {
        if (!otherSourceDetail) {
            setOtherSourceDetail([
                {
                    sourceId: undefined,
                    sourceName: undefined,
                },
            ]);
            return;
        } else {
            const updatedRequest = [...otherSourceDetail];
            updatedRequest[0].sourceId = undefined;
            updatedRequest[0].sourceName = undefined;
            setOtherSourceDetail(updatedRequest);
            return;
        }
    }, [otherSourceDetail, setOtherSourceDetail]);

    const handleDropdownChange = useCallback(
        (
            id: string,
            event: FormEvent<HTMLDivElement>,
            option?: IDropdownOption<any> | undefined
        ) => {
            if (id === "networkCompany") {
                if (!otherSourceDetail) {
                    setOtherSourceDetail([
                        {
                            networkCompanyId: option?.key as string,
                            networkCompanyName: option?.text,
                        },
                    ]);
                    return;
                } else {
                    const updatedRequest = [...otherSourceDetail];
                    updatedRequest[0].networkCompanyId = option?.key as string;
                    updatedRequest[0].networkCompanyName = option?.text;
                    setOtherSourceDetail(updatedRequest);
                    return;
                }
            }
            if (id === "source") {
                if (!otherSourceDetail) {
                    setOtherSourceDetail([
                        {
                            sourceId: option?.key as string,
                            sourceName: option?.text,
                        },
                    ]);
                    return;
                } else {
                    const updatedRequest = [...otherSourceDetail];
                    updatedRequest[0].sourceId = option?.key as string;
                    updatedRequest[0].sourceName = option?.text;
                    setOtherSourceDetail(updatedRequest);
                    return;
                }
            }
        },
        [otherSourceDetail, setOtherSourceDetail]
    );

    if (isReadOnly) {
        return (
            <>
                <TextField
                    label="Network Company: "
                    borderless
                    readOnly
                    value={
                        otherSourceDetail &&
                        otherSourceDetail[0]?.networkCompanyName
                    }
                    styles={inlineInputStyle}
                />
                <TextField
                    label="Source: "
                    borderless
                    readOnly
                    value={
                        otherSourceDetail && otherSourceDetail[0]?.sourceName
                    }
                    styles={inlineInputStyle}
                />
            </>
        );
    }

    return (
        <>
            <Dropdown
                id="networkCompany"
                placeholder="Select Network Company"
                required
                label="Network Company"
                options={networkCompanies?.slice(1) ?? []}
                onChange={(event, option) =>
                    handleDropdownChange("networkCompany", event, option)
                }
                selectedKey={
                    (otherSourceDetail &&
                        otherSourceDetail[0]?.networkCompanyId) ??
                    null
                }
                // errorMessage={
                //     showLineErrorMessage &&
                //     getErrorMessage(selectedNetworkCompany)
                // }
            />
            <Dropdown
                id="source"
                placeholder="Select Source"
                required={isExistingAsset ? false : true}
                label="Source"
                options={sources ?? []}
                selectedKey={
                    (otherSourceDetail && otherSourceDetail[0]?.sourceId) ??
                    null
                }
                onRenderCaretDown={(props) => (
                    <Stack horizontal>
                        {isExistingAsset &&
                        otherSourceDetail &&
                        otherSourceDetail[0]?.sourceId ? (
                            <ActionButton
                                iconProps={{ iconName: "Clear" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearSource();
                                }}
                                styles={clearIconStyle}
                                disabled={isReadOnly}
                            />
                        ) : null}
                        <Icon iconName="ChevronDown" />
                    </Stack>
                )}
                onChange={(event, option) =>
                    handleDropdownChange("source", event, option)
                }
            />
        </>
    );
};

export default React.memo(DropdownComponent);

interface IDatePickerProps {
    isExistingAsset: boolean | undefined;
    isReadOnly: boolean | undefined;
}

const DatePickerComponent: React.FC<IDatePickerProps> = ({
    isExistingAsset,
    isReadOnly = undefined,
}) => {
    const { otherSourceDetail, setOtherSourceDetail } =
        useOtherSourceModalContext() as IOtherSourceModalContext;

    const handleDateChange = useCallback(
        (date: Date) => {
            if (!otherSourceDetail) {
                setOtherSourceDetail([
                    {
                        receivedDate: date,
                    },
                ]);
                return;
            } else {
                const updatedRequest = [...otherSourceDetail];
                updatedRequest[0].receivedDate = date;
                setOtherSourceDetail(updatedRequest);
                return;
            }
        },
        [otherSourceDetail, setOtherSourceDetail]
    );

    if (isReadOnly) {
        return (
            <TextField
                label={isExistingAsset ? "Added on: " : "Received On: "}
                borderless
                readOnly
                value={
                    otherSourceDetail &&
                    otherSourceDetail[0]?.receivedDate &&
                    convertDateToddMMMYYYFormat(
                        convertUTCDateToLocalDate(
                            otherSourceDetail[0]?.receivedDate
                        )
                    )
                }
                styles={inlineInputStyle}
            />
        );
    }
    return (
        <>
            {!isExistingAsset ? (
                <Stack>
                    <StyledLabel
                        text="Received On"
                        isMandatory={true}
                    ></StyledLabel>
                    <DatePicker
                        placeholder="Received Date"
                        value={
                            otherSourceDetail?.[0]?.receivedDate &&
                            convertUTCDateToLocalDate(
                                new Date(otherSourceDetail[0]?.receivedDate)
                            )
                        }
                        maxDate={new Date(Date.now())}
                        onSelectDate={(date: Date | null | undefined) =>
                            date && handleDateChange(date)
                        }
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
                            isExistingAsset &&
                            otherSourceDetail?.[0]?.receivedDate
                                ? new Date(
                                      otherSourceDetail[0].receivedDate
                                  ).toLocaleDateString()
                                : new Date().toLocaleDateString()
                        }
                        value={new Date()}
                        maxDate={new Date(Date.now())}
                        minDate={new Date(Date.now())}
                        disabled={isReadOnly}
                    />
                </Stack>
            )}
        </>
    );
};

export const OtherSourceDatePicker = React.memo(DatePickerComponent);

interface FileUploadComponentProps {
    isExistingAsset: boolean;
    otherSourceId: string | undefined;
    children: React.ReactNode;
    isReadOnly: boolean;
    toggleDeleteDialog: () => void;
    isDeleting: boolean;
    setIsFileChange: React.Dispatch<React.SetStateAction<boolean>>;
    setFailure: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
    isExistingAsset,
    otherSourceId,
    children,
    isReadOnly,
    toggleDeleteDialog,
    isDeleting,
    setIsFileChange,
    setFailure,
}) => {
    const { otherSourceDetail, setOtherSourceDetail } =
        useOtherSourceModalContext() as IOtherSourceModalContext;
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const documentFileNameHandler = useCallback(
        (fileName: string, file: File) => {
            if (!otherSourceDetail) {
                setOtherSourceDetail([
                    {
                        fileName: fileName,
                        supportingDocumentFile: file,
                    },
                ]);
                return;
            } else {
                const updatedRequest = [...otherSourceDetail];
                updatedRequest[0].fileName = fileName;
                updatedRequest[0].supportingDocumentFile = file;
                setOtherSourceDetail(updatedRequest);
                return;
            }
        },
        [otherSourceDetail, setOtherSourceDetail]
    );
    const downloadHandler = useCallback(async () => {
        setIsDownloading(true);
        if (otherSourceId !== undefined) {
            try {
                await DownloadSupportDocument(
                    otherSourceId,
                    otherSourceDetail?.[0]?.fileName
                );
                setIsDownloading(false);
            } catch (err: any) {
                setFailure(err as string);
            }
        }
    }, [otherSourceDetail, otherSourceId, setFailure]);

    if (isReadOnly && !isExistingAsset) {
        return (
            <>
                {children}
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
                            <Stack horizontal tokens={{ childrenGap: 10 }}>
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
        );
    }

    return (
        <>
            {!isExistingAsset ? (
                <>
                    <ContainerDiv style={{ width: 200, marginTop: 2 }}>
                        {children}
                    </ContainerDiv>

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
                                label={isDeleting ? "Deleting" : "Downloading"}
                                description="Please wait"
                            />
                        ) : otherSourceDetail?.[0]?.supportingDocumentFilePath
                              ?.length > 0 ? (
                            <Stack horizontal tokens={{ childrenGap: 10 }}>
                                <IconButton
                                    iconProps={{
                                        iconName: "Download",
                                        style: {
                                            color: "black",
                                        },
                                    }}
                                    onClick={downloadHandler}
                                />
                                <IconButton
                                    iconProps={{
                                        iconName: "Delete",
                                        style: {
                                            color: "red",
                                        },
                                    }}
                                    onClick={toggleDeleteDialog}
                                />
                            </Stack>
                        ) : (
                            <HiddenLabel>
                                <HiddenInput
                                    accept=".eml,.pdf,.jpeg,.jpg,.png"
                                    type="file"
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        if (
                                            e.currentTarget.files &&
                                            e.currentTarget.files.length > 0
                                        ) {
                                            const allowedFileTypes = [
                                                "eml",
                                                "pdf",
                                                "jpeg",
                                                "jpg",
                                                "png",
                                            ];
                                            const selectedFileType =
                                                e.currentTarget.files[0].name
                                                    .split(".")
                                                    .pop()
                                                    ?.toLowerCase();

                                            if (
                                                selectedFileType &&
                                                allowedFileTypes.includes(
                                                    selectedFileType
                                                )
                                            ) {
                                                documentFileNameHandler(
                                                    e.currentTarget.files[0]
                                                        .name,
                                                    e.currentTarget.files[0]
                                                );
                                                setIsFileChange(true);
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
                                                otherSourceDetail?.[0]?.fileName
                                            }
                                        >
                                            {otherSourceDetail?.[0]?.fileName}
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
                                        styles={hostStyles}
                                    >
                                        <IconButton iconProps={infoIcon} />
                                    </TooltipHost>
                                </ContainerDiv>
                            </HiddenLabel>
                        )}
                    </Stack>
                </>
            ) : null}
        </>
    );
};

interface IFooterProps {
    setIsModalVisible: () => void;
    isExistingAsset: boolean;
    submitData: (
        register?: boolean,
        needsCloseRefresh?: boolean
    ) => Promise<void>;
    toggleIsExistingAsset: () => void;
    setFailure: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const OtherSourceModalFooter: React.FC<IFooterProps> = ({
    setIsModalVisible,
    isExistingAsset,
    submitData,
    toggleIsExistingAsset,
    setFailure,
}) => {
    const { otherSourceDetail, setOtherSourceDetail } =
        useOtherSourceModalContext() as IOtherSourceModalContext;
    const saveDisabled = () => {
        const firstItem = otherSourceDetail?.[0];
        if (!otherSourceDetail?.[0].networkCompanyId) {
            return true;
        }

        if (!isExistingAsset) {
            if (
                firstItem &&
                (!firstItem.sourceId ||
                    !firstItem.receivedDate ||
                    !firstItem.fileName ||
                    !firstItem.documentNumber ||
                    firstItem.documentNumber.length > 50)
            ) {
                return true;
            }
        }

        return false;
    };

    return (
        <Stack horizontal horizontalAlign="space-between">
            <Stack horizontal>
                {!otherSourceDetail?.some((i) => i.assetStatus) && (
                    <PrimaryButton
                        style={{ width: "600" }}
                        onClick={() => submitData(true, true)}
                        disabled={saveDisabled()}
                        text="Register to Inventory"
                    />
                )}
            </Stack>
            <Stack horizontal horizontalAlign="end">
                {!otherSourceDetail?.some((i) => i.assetStatus) && (
                    <>
                        <DefaultButton
                            styles={DashboardStyle.buttonStyles}
                            onClick={() => {
                                setOtherSourceDetail([
                                    {},
                                ] as OtherSourceInventoryProps[]);
                                setIsModalVisible();
                                if (isExistingAsset) {
                                    toggleIsExistingAsset();
                                }
                                setFailure(undefined);
                            }}
                            text="Cancel"
                        />
                        <PrimaryButton
                            styles={DashboardStyle.buttonStyles}
                            onClick={() => submitData(false, true)}
                            text="Save"
                            disabled={saveDisabled()}
                        />
                    </>
                )}
                {otherSourceDetail?.some((i) => i.assetStatus) && (
                    <Stack>
                        <Stack.Item align="end">
                            <DefaultButton
                                text="Back"
                                onClick={() => {
                                    setOtherSourceDetail([
                                        {},
                                    ] as OtherSourceInventoryProps[]);
                                    setIsModalVisible();
                                    setFailure(undefined);
                                }}
                            />
                        </Stack.Item>
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
};
