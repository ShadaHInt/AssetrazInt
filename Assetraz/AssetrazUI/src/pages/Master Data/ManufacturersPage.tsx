import { useState } from "react";

import { PrimaryButton, Link } from "@fluentui/react";
import { makeStyles } from "@fluentui/react-theme-provider";
import { IColumn } from "@fluentui/react/lib/DetailsList";

import useService from "../../Hooks/useService";
import { GetManufacturersForDashboard } from "../../services/manufacturerService";

import PageTemplate from "../../components/common/PageTemplate";
import ManufacturerModal from "../../components/manufacturer/ManufacturerModal";
import StyledDetailsList from "../../components/common/StyledDetailsList";

import { IManufacturer } from "../../types/Manufacturer";

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

export const Action = {
    ADD: "add",
    UPDATE: "update",
    DELETE: "delete",
    DELETEEXISTING: "deleteExisting",
};

const ManufacturersPage = () => {
    const {
        data: manufacturers,
        isLoading,
        errorOccured,
        refresh: refreshData,
    } = useService(GetManufacturersForDashboard);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedManufacturer, setSelectedManufacturer] =
        useState<IManufacturer>();

    const classes = detailsListStyles();

    const AddManufacturerButton = () => (
        <PrimaryButton
            text="+ Add Manufacturer"
            styles={{
                root: {
                    marginRight: 14,
                    marginBottom: 20,
                },
            }}
            onClick={() => setIsModalOpen(true)}
        />
    );

    const dismissModal = (action?: string) => {
        action && refreshData();
        switch (action) {
            case Action.ADD:
                setSuccessMessage("Successfully added");
                break;
            case Action.UPDATE:
                setSuccessMessage("Successfully updated");
                break;
            case Action.DELETE:
                setSuccessMessage("Successfully deleted");
                break;
            case Action.DELETEEXISTING:
                setErrorMessage(
                    "Manufacturer made inactive. There are associated assets with this vendor."
                );
                break;
        }
        setIsModalOpen(false);
        setSelectedManufacturer(undefined);
    };

    const updateManufacturer = (manufacturer: IManufacturer) => {
        setSelectedManufacturer(manufacturer);
        setIsModalOpen(true);
    };

    const _columns: IColumn[] = [
        {
            key: "manufacturerName",
            name: "Manufacturer Name",
            fieldName: "manufacturerName",
            minWidth: 100,
            maxWidth: 230,
            isResizable: true,
            onRender: (item: IManufacturer) => {
                return (
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            updateManufacturer(item);
                        }}
                    >
                        {item?.manufacturerName}
                    </Link>
                );
            },
        },
        {
            key: "preferredManufacturer",
            name: "Preferred Manufacturer",
            fieldName: "preferredManufacturer",
            minWidth: 100,
            maxWidth: 230,
            isResizable: true,
            onRender: (item: IManufacturer) => {
                if (item?.preferredManufacturer === true) {
                    return "Yes";
                } else {
                    return "No";
                }
            },
        },
        {
            key: "active",
            name: "Active?",
            fieldName: "active",
            minWidth: 100,
            maxWidth: 230,
            isResizable: true,
            onRender: (item: IManufacturer) => {
                if (item?.active === true) {
                    return "Yes";
                } else {
                    return "No";
                }
            },
        },
    ];

    return (
        <div className={classes.root}>
            <div>
                <PageTemplate
                    heading=""
                    isLoading={isLoading}
                    successMessageBar={successMessage}
                    setSuccessMessageBar={() => setSuccessMessage("")}
                    errorOccured={errorOccured}
                    headerElementRight={<AddManufacturerButton />}
                    errorMessage={errorMessage}
                    clearErrorMessage={() => setErrorMessage("")}
                >
                    {manufacturers && (
                        <StyledDetailsList
                            data={manufacturers}
                            columns={_columns}
                            emptymessage="No manufacturers found"
                        />
                    )}
                    {isModalOpen && (
                        <ManufacturerModal
                            isModalOpen={isModalOpen}
                            dismissModal={dismissModal}
                            selectedManufacturer={selectedManufacturer}
                        />
                    )}
                </PageTemplate>
            </div>
        </div>
    );
};

export default ManufacturersPage;
