import PageTemplate from "../../components/common/PageTemplate";
import { useState } from "react";
import { IColumn } from "@fluentui/react/lib/DetailsList";
import { PrimaryButton, Link } from "@fluentui/react";
import { GetCategoriesForMasterData } from "../../services/categoryService";
import { ICategory } from "../../types/Category";
import StyledDetailsList from "../../components/common/StyledDetailsList";
import { makeStyles } from "@fluentui/react-theme-provider";
import CategoryModal from "../../components/categories/CategoryModal";
import useService from "../../Hooks/useService";

const detailsListStyles = makeStyles(() => ({
    root: {
        width: "100%",
        marginBottom: "50px",
    },
    details: {},
    textField: {
        maxWidth: "300px",
    },
    table: {},
}));
const CategoriesPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [operationSuccess, setOperationSuccess] = useState<string>();
    const [categorySelected, setCategorySelected] = useState({});

    const {
        data: categories,
        isLoading,
        errorOccured,
        refresh: refreshData,
    } = useService(GetCategoriesForMasterData);

    const classes = detailsListStyles();

    const AddCategoryButton = () => (
        <PrimaryButton
            text="+ Add Category"
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

    const onCategoryClick = (categoryDetails: object) => {
        setCategorySelected(categoryDetails);
        setShowModal(true);
    };

    const _columns: IColumn[] = [
        {
            key: "categoryName",
            name: "Category",
            fieldName: "categoryName",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: ICategory) => {
                return (
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            onCategoryClick(item);
                        }}
                    >
                        {item?.categoryName}
                    </Link>
                );
            },
        },
        {
            key: "issuable",
            name: "Issuable",
            fieldName: "issuable",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: ICategory) => {
                if (item?.issuable === false) {
                    return "No";
                } else {
                    return "Yes";
                }
            },
        },
        {
            key: "assetTagRequired",
            name: "Asset Tag Required",
            fieldName: "assetTagRequired",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: ICategory) => {
                if (item?.assetTagRequired === true) {
                    return "Yes";
                } else {
                    return "No";
                }
            },
        },
        {
            key: "serialNumberRequired",
            name: "Serial Number Required",
            fieldName: "serialNumberRequired",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: ICategory) => {
                if (item?.serialNumberRequired === true) {
                    return "Yes";
                } else {
                    return "No";
                }
            },
        },
        {
            key: "warrantyRequired",
            name: "Warranty Date Required",
            fieldName: "warrantyRequired",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: ICategory) => {
                if (item?.warrantyRequired === true) {
                    return "Yes";
                } else {
                    return "No";
                }
            },
        },
        {
            key: "active",
            name: "Active",
            fieldName: "active",
            minWidth: 150,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: ICategory) => {
                if (item?.active === true) {
                    return "Yes";
                } else {
                    return "No";
                }
            },
        },
        {
            key: "unitOfMeasurement",
            name: "Unit Of Measurement",
            fieldName: "unitOfMeasurement",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
        },
    ];

    return (
        <div className={classes.root}>
            <div>
                <PageTemplate
                    isLoading={isLoading}
                    errorOccured={errorOccured}
                    successMessageBar={operationSuccess}
                    setSuccessMessageBar={setOperationSuccess}
                    headerElementRight={<AddCategoryButton />}
                >
                    {categories && (
                        <StyledDetailsList
                            data={categories}
                            columns={_columns}
                            emptymessage="No categories found"
                        />
                    )}
                    {categories && showModal && (
                        <CategoryModal
                            categorySelected={categorySelected}
                            dismissPanel={(
                                isSuccess: boolean,
                                message?: string
                            ) => {
                                setShowModal(false);
                                setCategorySelected({});
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

export default CategoriesPage;
