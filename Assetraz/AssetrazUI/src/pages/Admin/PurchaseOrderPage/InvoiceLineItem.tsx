import {
    Checkbox,
    DatePicker,
    Stack,
    StackItem,
    TextField,
    TooltipHost,
} from "@fluentui/react";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useCallback,
    useState,
} from "react";
import {
    ContainerDiv,
    HiddenInput,
    StyledFontIcon,
    StyledSpan,
} from "../../../components/common/FileInput";
import {
    convertDateToddMMMYYYFormat,
    convertUTCDateToLocalDate,
} from "../../../Other/DateFormat";
import { Invoice, PurchaseDetails } from "../../../types/PurchaseOrder";

import { HiddenLabel, StyledDiv, TextOverflow } from "./PurchaseOrderStyles";

interface inputs {
    isReadOnly: boolean;
    purchaseDetails: PurchaseDetails;
    isInvoiceUploaded: boolean;
    setIsHandedOver: Dispatch<SetStateAction<boolean>>;
    setInvoiceUploadDetails: Dispatch<SetStateAction<Invoice>>;
    invoiceUploadDetails: Invoice;
}

const InvoiceLineItem = (props: inputs) => {
    const {
        isReadOnly,
        purchaseDetails,
        isInvoiceUploaded,
        setIsHandedOver,
        setInvoiceUploadDetails,
        invoiceUploadDetails,
    } = props;
    const [fileName, setFileName] = useState<string>("");

    const inlineInputStyle = {
        root: {
            padding: "1px 0",
            label: {
                whiteSpace: "nowrap",
                padding: "5px 0px 5px 0px",
                lineHeight: 22,
                fontSize: 16,
            },
            lineHeight: "22px",
        },
        fieldGroup: {
            minWidth: 310,
        },
        wrapper: { display: "flex" },
    };
    const multilineInputStyle = {
        ...inlineInputStyle,
        fieldGroup: {
            ...inlineInputStyle.fieldGroup,
            minWidth: 230,
        },
    };
    const handleFile = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const file = e.target.files[0];
                setFileName(e.target.files[0].name);
                if (!e.target.files) return;
                setInvoiceUploadDetails((preState: Invoice) => ({
                    ...preState,
                    invoiceFile: file,
                }));
            }
        },
        [setInvoiceUploadDetails]
    );
    const handleInvoiceNumber = useCallback(
        (e: any, value?: string) => {
            const field = e.target.name;
            setInvoiceUploadDetails({
                ...invoiceUploadDetails,
                [field]: value,
                purchaseOrderRequestId: purchaseDetails?.purchaseOrderRequestId,
            });
        },
        [
            invoiceUploadDetails,
            purchaseDetails?.purchaseOrderRequestId,
            setInvoiceUploadDetails,
        ]
    );

    const handleInvoiceDate = useCallback(
        (value: any) => {
            if (value) {
                const invDate = new Date(value);
                setInvoiceUploadDetails({
                    ...invoiceUploadDetails,
                    invoiceDate: invDate,
                });
            }
        },
        [invoiceUploadDetails, setInvoiceUploadDetails]
    );

    const handleCheckbox = useCallback(
        (e: any): void => {
            setInvoiceUploadDetails({
                ...invoiceUploadDetails,
                isHandedOver: e.target.checked,
            });
            setIsHandedOver(e.target.checked);
        },
        [invoiceUploadDetails, setInvoiceUploadDetails, setIsHandedOver]
    );

    return isInvoiceUploaded ? (
        <>
            <TooltipHost
                content={
                    isInvoiceUploaded
                        ? purchaseDetails?.invoiceNumber
                        : invoiceUploadDetails?.invoiceNumber
                }
            >
                <TextField
                    label="Invoice Number:"
                    value={
                        isInvoiceUploaded
                            ? purchaseDetails?.invoiceNumber
                            : invoiceUploadDetails?.invoiceNumber
                    }
                    readOnly
                    styles={multilineInputStyle}
                    borderless
                    name="invoiceNumber"
                />
            </TooltipHost>
            <TextField
                label="Invoice Date:"
                value={
                    isInvoiceUploaded
                        ? convertDateToddMMMYYYFormat(
                              convertUTCDateToLocalDate(
                                  purchaseDetails?.invoiceDate
                              )
                          )
                        : convertDateToddMMMYYYFormat(
                              convertUTCDateToLocalDate(
                                  invoiceUploadDetails?.invoiceDate
                              )
                          )
                }
                readOnly
                styles={inlineInputStyle}
                borderless
                name="invoiceDate"
            />
            <Checkbox
                label="Handover assets to IT"
                onChange={handleCheckbox}
                checked={
                    isReadOnly ? isReadOnly : invoiceUploadDetails?.isHandedOver
                }
                disabled={isReadOnly}
            />
        </>
    ) : (
        <Stack
            horizontal
            style={{
                margin: "8px 8px 0px 0",
            }}
            horizontalAlign="space-between"
            wrap
        >
            <Stack.Item style={{ width: "45%" }} align="center">
                <TextField
                    label="Invoice Number:"
                    name="invoiceNumber"
                    maxLength={40}
                    onChange={handleInvoiceNumber}
                />
            </Stack.Item>
            <Stack.Item style={{ width: "45%" }} align="center">
                <DatePicker
                    label="Invoice Date:"
                    onSelectDate={handleInvoiceDate}
                    style={{
                        height: "55px",
                        lineHeight: "15px",
                    }}
                    value={
                        invoiceUploadDetails?.invoiceDate &&
                        new Date(invoiceUploadDetails?.invoiceDate)
                    }
                    maxDate={new Date()}
                    minDate={
                        new Date(
                            convertDateToddMMMYYYFormat(
                                convertUTCDateToLocalDate(
                                    purchaseDetails.poDate
                                )
                            )
                        )
                    }
                />
            </Stack.Item>
            <Stack
                horizontal
                style={{
                    margin: "8px 20px 0px 0",
                }}
                horizontalAlign="space-between"
                wrap
            >
                <StackItem style={{ width: "90%" }} align="center">
                    <HiddenLabel>
                        Invoice:
                        <HiddenInput
                            accept=".eml,.pdf, .jpeg, .jpg, .png"
                            type="file"
                            onChange={handleFile}
                            readOnly
                        />
                        <ContainerDiv>
                            <StyledDiv>
                                <TextOverflow title={fileName}>
                                    {fileName}
                                </TextOverflow>
                                <StyledFontIcon
                                    aria-label="Upload"
                                    iconName="Upload"
                                />
                            </StyledDiv>
                        </ContainerDiv>
                        <StyledSpan>
                            File types : eml, pdf, jpeg, jpg, png
                        </StyledSpan>
                    </HiddenLabel>
                </StackItem>
            </Stack>
        </Stack>
    );
};
export default InvoiceLineItem;
