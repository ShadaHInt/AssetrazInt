import PageTemplate from "../../components/common/PageTemplate";
import { useState } from "react";
import { IColumn } from "@fluentui/react/lib/DetailsList";
import { PrimaryButton, Link } from "@fluentui/react";
import { GetSourcesForMasterData } from "../../services/sourceService";
import { ISource } from "../../types/Source";
import StyledDetailsList from "../../components/common/StyledDetailsList";
import { makeStyles } from "@fluentui/react-theme-provider";
import SourceModal from "../../components/sources/SourceModal";
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
const SourcesPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [operationSuccess, setOperationSuccess] = useState<string>();
    const [sourceSelected, setSourceSelected] = useState({});

    const {
        data: sources,
        isLoading,
        errorOccured,
        refresh: refreshData,
    } = useService(GetSourcesForMasterData);

    const classes = detailsListStyles();

    const AddSourceButton = () => (
        <PrimaryButton
            text="Add Source"
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

    const onSourceClick = (sourceDetails: object) => {
        setSourceSelected(sourceDetails);
        setShowModal(true);
    };

    const _columns: IColumn[] = [
        {
            key: "sourceName",
            name: "Source of Asset",
            fieldName: "sourceName",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: ISource) => {
                return (
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            onSourceClick(item);
                        }}
                    >
                        {item?.sourceName}
                    </Link>
                );
            },
        },
        {
            key: "active",
            name: "Active?",
            fieldName: "active",
            minWidth: 100,
            maxWidth: 130,
            isResizable: true,
            onRender: (item: ISource) => {
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
                    isLoading={isLoading}
                    errorOccured={errorOccured}
                    successMessageBar={operationSuccess}
                    setSuccessMessageBar={setOperationSuccess}
                    headerElementRight={<AddSourceButton />}
                >
                    {sources && (
                        <StyledDetailsList
                            data={sources}
                            columns={_columns}
                            emptymessage="No sources found"
                        />
                    )}
                    {sources && showModal && (
                        <SourceModal
                            sourceSelected={sourceSelected}
                            dismissPanel={(
                                isSuccess: boolean,
                                message?: string
                            ) => {
                                setShowModal(false);
                                setSourceSelected({});
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

export default SourcesPage;
