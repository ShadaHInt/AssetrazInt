import PageTemplate from "../../components/common/PageTemplate";
import { useState } from "react";
import { IColumn } from "@fluentui/react/lib/DetailsList";
import { PrimaryButton, Link } from "@fluentui/react";
import { GetCompaniesForDashboard } from "../../services/networkCompanyService";
import { INetworkCompany } from "../../types/NetworkCompany";
import StyledDetailsList from "../../components/common/StyledDetailsList";
import { makeStyles } from "@fluentui/react-theme-provider";
import { Tooltip } from "../../components/common/Tooltip";
import NetworkCompanyModal from "../../components/networkCompanies/NetworkCompanyModal";
import useService from "../../Hooks/useService";

const detailsListStyles = makeStyles(() => ({
    root: {
        width: "100%",
        marginBottom: "50px",
    },
    tooltip: {
        "& .ms-TooltipHost": {
            width: "100px",
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

const NetworkCompaniesPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [operationSuccess, setOperationSuccess] = useState<string>();
    const [networkCompanySelected, setNetworkCompanySelected] = useState({});

    const {
        data: companies,
        isLoading,
        errorOccured,
        refresh: refreshData,
    } = useService(GetCompaniesForDashboard);

    const classes = detailsListStyles();

    const AddCompanyButton = () => (
        <PrimaryButton
            text="+ Add Company"
            styles={{
                root: {
                    marginRight: 14,
                    marginBottom: 20,
                },
            }}
            onClick={() => handleClick()}
        />
    );

    const handleClick = () => {
        setShowModal(true);
    };

    const onNetworkCompanySelected = (companyDetails: object) => {
        setNetworkCompanySelected(companyDetails);
        setShowModal(true);
    };

    const _columns: IColumn[] = [
        {
            key: "companyName",
            name: "Company Name",
            fieldName: "companyName",
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: INetworkCompany) => {
                return (
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            onNetworkCompanySelected(item);
                        }}
                    >
                        {item?.companyName}
                    </Link>
                );
            },
        },
        {
            key: "companyAddressLine1",
            name: "Address",
            fieldName: "companyAddressLine1",
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            onRender: (item: INetworkCompany) => {
                let address =
                    item?.companyAddressLine1 +
                    ", " +
                    item?.companyAddressLine2;
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
            key: "state",
            name: "State",
            fieldName: "state",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "contactNumber",
            name: "Contact Number",
            fieldName: "contactNumber",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
        {
            key: "isPrimary",
            name: "Is Primary?",
            fieldName: "isPrimary",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: INetworkCompany) => {
                if (item?.isPrimary === true) {
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
                    errorOccured={errorOccured}
                    headerElementRight={<AddCompanyButton />}
                    successMessageBar={operationSuccess}
                    setSuccessMessageBar={setOperationSuccess}
                >
                    {companies && (
                        <StyledDetailsList
                            data={companies}
                            columns={_columns}
                            emptymessage="No network companies found"
                        />
                    )}
                    {companies && showModal && (
                        <NetworkCompanyModal
                            networkCompanySelected={networkCompanySelected}
                            dismissPanel={(
                                isSuccess: boolean,
                                message?: string
                            ) => {
                                setShowModal(false);
                                setNetworkCompanySelected({});
                                if (isSuccess) {
                                    setOperationSuccess(
                                        `Successfully ${message}`
                                    );
                                    refreshData();
                                }
                            }}
                        />
                    )}
                </PageTemplate>
            </div>
        </div>
    );
};

export default NetworkCompaniesPage;
