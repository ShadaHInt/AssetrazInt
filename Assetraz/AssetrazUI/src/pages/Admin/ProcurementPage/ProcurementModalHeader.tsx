import {
    PrimaryButton,
    Separator,
    Stack,
    TextField,
    Text,
    IDropdownOption,
} from "@fluentui/react";
import { Dispatch, FC, SetStateAction } from "react";
import { ProcurementStatus } from "../../../constants/ProcurementStatus";
import { convertDateToddMMMYYYFormat } from "../../../Other/DateFormat";
import getErrorMessage from "../../../Other/InputValidation";
import { NetworkCompany } from "../../../types/NetworkCompany";
import { IProcurements, IQuoteVendors } from "../../../types/Procurement";
import { Vendor } from "../../../types/Vendor";
import VendorParticipationLineItem from "./VendorPartipationLineItem";
import {
    IProcurementRequestContextValues,
    useProcurementRequestContext,
} from "../../../Contexts/ProcurementRequestContext";
import { SearchableDropdown } from "../../../components/common/SearchableDropdown";
import { dropdownStyles } from "./ProcurementPage.styles";

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

interface IModalHeaderProps {
    isReadOnly: boolean;
    vendors?: IDropdownOption<Vendor>[] | null;
    networkCompanies?: IDropdownOption<NetworkCompany>[] | null;
    selectedNetworkCompany?: string;
    selectedVendors: string[];
    selectedProcurement?: IProcurements;
    totalAssetAmount: number;
    showLineErrorMessage: boolean;
    vendorQuoteUploadDetails?: IQuoteVendors[];
    setNeedsRefresh: Dispatch<SetStateAction<boolean>>;
    procurementNote?: string;
    setProcurementNote: Dispatch<SetStateAction<string | undefined>>;
    addRequest: () => void;
    setSelectedNetworkCompany: Dispatch<SetStateAction<string | undefined>>;
    setSelectedVendors: Dispatch<SetStateAction<string[]>>;
    setVendorQuoteUploadDetails: Dispatch<SetStateAction<IQuoteVendors[]>>;
    setSuccessMessageModal: Dispatch<SetStateAction<string | undefined>>;
    setFailure: Dispatch<SetStateAction<string | undefined>>;
}

const ModalHeader: FC<IModalHeaderProps> = (props: any) => {
    const {
        vendors,
        isReadOnly,
        networkCompanies,
        selectedNetworkCompany,
        setSelectedNetworkCompany,
        selectedVendors,
        setSelectedVendors,
        procurementNote,
        addRequest,
        selectedProcurement,
        vendorQuoteUploadDetails,
        setVendorQuoteUploadDetails,
        setSuccessMessageModal,
        setFailure,
        setNeedsRefresh,
        totalAssetAmount,
        showLineErrorMessage,
        setProcurementNote,
    } = props;

    const { hasUserRequest } =
        useProcurementRequestContext() as IProcurementRequestContextValues;

    const totalNumberOfVendorsNumber = selectedProcurement?.vendors.length;
    const shortlistedVendorsNumber = vendorQuoteUploadDetails?.filter(
        (v: IQuoteVendors) => v.isShortListed === true
    ).length;
    const status = selectedProcurement?.status;

    const viewModalHeaderWithQuoteDetails = () => {
        return status === ProcurementStatus.Generated || isReadOnly;
    };

    if (
        selectedProcurement &&
        viewModalHeaderWithQuoteDetails() &&
        selectedProcurement.requestRaisedOn
    )
        return (
            <Stack horizontal>
                <Stack tokens={{ childrenGap: 10 }} style={{ width: "29%" }}>
                    <Stack.Item>
                        <TextField
                            label="Total number of vendor participants: "
                            borderless
                            readOnly
                            value={totalNumberOfVendorsNumber}
                            styles={inlineInputStyle}
                        />
                        <TextField
                            label="Shortlisted Vendors: "
                            borderless
                            readOnly
                            value={shortlistedVendorsNumber}
                            styles={inlineInputStyle}
                        />
                    </Stack.Item>
                    <Stack.Item>
                        <TextField
                            label="Request Generated On:"
                            styles={inlineInputStyle}
                            value={convertDateToddMMMYYYFormat(
                                selectedProcurement?.requestRaisedOn
                            )}
                            borderless
                        />
                        {isReadOnly && (
                            <TextField
                                label="Request Approved On:"
                                styles={inlineInputStyle}
                                value={convertDateToddMMMYYYFormat(
                                    selectedProcurement?.approvedOn
                                )}
                                borderless
                            />
                        )}
                    </Stack.Item>
                    <TextField
                        label="Total Order Value: "
                        styles={inlineInputStyle}
                        readOnly
                        borderless
                        value={isNaN(totalAssetAmount) ? "" : totalAssetAmount}
                    />
                    <Stack.Item style={{ width: "100%" }}>
                        <TextField
                            label="Notes"
                            styles={inlineInputStyle}
                            multiline
                            value={procurementNote}
                            onChange={(e: any, newValue?: string) => {
                                setProcurementNote(newValue);
                            }}
                            readOnly={isReadOnly}
                        />
                    </Stack.Item>
                </Stack>
                <Separator
                    vertical
                    styles={{
                        root: {
                            "&::after": {
                                width: 3,
                                margin: "-15px 0",
                            },
                        },
                    }}
                />
                <Stack style={{ width: "71%" }}>
                    <Text
                        variant="large"
                        style={{
                            fontWeight: 600,
                            paddingLeft: 16,
                            paddingBottom: 8,
                        }}
                    >
                        Vendor Participation
                    </Text>
                    <Stack style={{ height: "150px", overflowY: "scroll" }}>
                        {selectedProcurement?.vendors.map((v: any) => (
                            <VendorParticipationLineItem
                                key={v.vendorId}
                                vendorDetails={v}
                                setVendorQuoteUploadDetails={
                                    setVendorQuoteUploadDetails
                                }
                                vendorQuoteUploadDetails={
                                    vendorQuoteUploadDetails
                                }
                                setNeedsRefresh={setNeedsRefresh}
                                setSuccessMessageModal={setSuccessMessageModal}
                                setFailure={setFailure}
                                isReadOnly={isReadOnly}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        );

    return (
        <Stack horizontal horizontalAlign="space-between" wrap>
            <Stack
                horizontal
                tokens={{ childrenGap: 10 }}
                style={{ width: "70%" }}
            >
                <Stack.Item style={{ width: "26%" }}>
                    <SearchableDropdown
                        placeholder="Select network company"
                        required
                        label="Network Company"
                        options={networkCompanies ? networkCompanies : []}
                        selectedKey={selectedNetworkCompany}
                        onChange={(e, item) =>
                            setSelectedNetworkCompany(item?.key)
                        }
                        errorMessage={
                            showLineErrorMessage &&
                            getErrorMessage(selectedNetworkCompany)
                        }
                        disabled={isReadOnly}
                        styles={dropdownStyles}
                    />
                </Stack.Item>
                <Stack.Item style={{ width: "26%" }}>
                    <SearchableDropdown
                        placeholder="Select vendors"
                        required
                        label="Vendor"
                        multiSelect
                        options={vendors ? vendors : []}
                        selectedKeys={selectedVendors}
                        onChange={(e, item) => {
                            if (item) {
                                setSelectedVendors((prevState: string[]) =>
                                    item.selected
                                        ? prevState
                                            ? [...prevState, item.key as string]
                                            : [item.key as string]
                                        : prevState
                                        ? prevState.filter(
                                              (key) => key !== item.key
                                          )
                                        : []
                                );
                            }
                        }}
                        errorMessage={
                            showLineErrorMessage &&
                            getErrorMessage(selectedVendors)
                        }
                        disabled={isReadOnly}
                        styles={dropdownStyles}
                    />
                </Stack.Item>
                <Stack.Item style={{ width: "45%" }}>
                    <TextField
                        placeholder="Note"
                        label="Note"
                        value={procurementNote}
                        onChange={(e: any, newValue?: string) => {
                            setProcurementNote(newValue);
                        }}
                    />
                </Stack.Item>
            </Stack>

            {!isReadOnly && !hasUserRequest && (
                <Stack.Item align="end">
                    <PrimaryButton
                        text="+ Add Specification"
                        onClick={() => addRequest()}
                        disabled={isReadOnly}
                    />
                </Stack.Item>
            )}
        </Stack>
    );
};

export default ModalHeader;
