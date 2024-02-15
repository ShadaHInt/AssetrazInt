import { useState, useEffect } from "react";
import { makeStyles } from "@fluentui/react-theme-provider";
import { useBoolean } from "@fluentui/react-hooks";
import { IColumn } from "@fluentui/react/lib/DetailsList";
import { PrimaryButton, Link } from "@fluentui/react";

import PageTemplate from "../../../components/common/PageTemplate";
import StyledDetailsList from "../../../components/common/StyledDetailsList";
import VendorModal from "./AddUpdateVendorModal";
import { Tooltip } from "../../../components/common/Tooltip";

import { GetVendorsForDashboard } from "../../../services/vendorService";
import { IVendor } from "../../../types/Vendor";

const detailsListStyles = makeStyles(() => ({
    root: {
        width: "100%",
        marginBottom: "50px",
    },
    tooltip: {
        "& .ms-TooltipHost": {
            width: "62px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
    },
    details: {},
    textField: {
        maxWidth: "300px",
    },
    table: {},
}));

const VendorsPage = () => {
    const [vendors, setVendors] = useState<IVendor[] | null>();
    const [selectedVendor, setSelectedVendor] = useState<IVendor | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAddModal, setIsAddModal] = useState<boolean>(false);
    const [showModal, { toggle: toggleShowModal }] = useBoolean(false);
    const [successMessage, setSuccessMessage] = useState<string>();

    const classes = detailsListStyles();

    const getData = async () => {
        setIsLoading(true);
        try {
            let response = await GetVendorsForDashboard();
            if (response?.length > 0) {
                setVendors(response);
            } else {
                setVendors([]);
            }
        } catch (err: any) {
            setVendors(null);
        } finally {
            setIsLoading(false);
        }
    };

    const AddVendorButton = () => (
        <PrimaryButton
            text="+ Add Vendor"
            onClick={() => {
                toggleShowModal();
                setIsAddModal(true);
            }}
            styles={{
                root: {
                    marginRight: 14,
                    marginBottom: 20,
                },
            }}
        />
    );

    useEffect(() => {
        getData();
    }, []);

    const _columns: IColumn[] = [
        {
            key: "vendorName",
            name: "Vendor Name",
            fieldName: "vendorName",
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: IVendor) => {
                return (
                    <Link
                        onClick={(e) => {
                            setSelectedVendor(item);
                            toggleShowModal();
                        }}
                    >
                        {item?.vendorName}
                    </Link>
                );
            },
        },
        {
            key: "vendorAddressLine1",
            name: "Address",
            fieldName: "vendorAddressLine1",
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            onRender: (item: IVendor) => {
                let address =
                    item?.vendorAddressLine1 + ", " + item?.vendorAddressLine2;
                if (address?.length > 50) {
                    return (
                        <div className={classes.tooltip}>
                            <Tooltip content={address}>{address}</Tooltip>
                        </div>
                    );
                } else {
                    return address;
                }
            },
        },
        {
            key: "city",
            name: "City",
            fieldName: "city",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "contactPerson",
            name: "Contact Person",
            fieldName: "contactPerson",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "contactNumber",
            name: "Phone Number",
            fieldName: "contactNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "emailAddress",
            name: "Email Address",
            fieldName: "emailAddress",
            minWidth: 130,
            maxWidth: 180,
            isResizable: true,
        },
        {
            key: "preferredVendor",
            name: "Preferred Vendor",
            fieldName: "preferredVendor",
            minWidth: 100,
            maxWidth: 110,
            isResizable: true,
            onRender: (item: IVendor) => {
                if (item?.preferredVendor === true) {
                    return "Yes";
                } else {
                    return "No";
                }
            },
        },
        {
            key: "gstin",
            name: "GSTIN Number",
            fieldName: "gstin",
            minWidth: 130,
            maxWidth: 150,
            isResizable: true,
        },
        {
            key: "active",
            name: "Active",
            fieldName: "active",
            minWidth: 90,
            maxWidth: 100,
            isResizable: true,
        },
    ];

    return (
        <div className={classes.root}>
            <PageTemplate
                heading=""
                isLoading={isLoading}
                headerElementRight={<AddVendorButton />}
                successMessageBar={successMessage}
                setSuccessMessageBar={setSuccessMessage}
            >
                {vendors && (
                    <StyledDetailsList
                        data={vendors}
                        columns={_columns}
                        emptymessage="No vendors found"
                    />
                )}

                {showModal && (
                    <VendorModal
                        toggleShowModal={toggleShowModal}
                        setSuccessMessage={setSuccessMessage}
                        getData={getData}
                        selectedVendor={selectedVendor}
                        setIsAddModal={setIsAddModal}
                        isAddModal={isAddModal}
                    />
                )}
            </PageTemplate>
        </div>
    );
};

export default VendorsPage;
