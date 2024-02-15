import { useState } from "react";

import PageTemplate from "../../components/common/PageTemplate";
import IssueReturnModal from "../../components/issue-return/IssueReturnModal";
import { AssetList } from "../request/AssetList";
import { useLocation } from "react-router-dom";
import {
    IIssuableAssetContext,
    useIssuableAssetContext,
} from "../../Contexts/IssuableAssetContext";

const IssueReturnPage = ({ setAssetsAPi, filteredCategory }: any) => {
    const location = useLocation();

    const { assets, selectedInventoryId, setSelectedInventoryId } =
        useIssuableAssetContext() as IIssuableAssetContext;
    const [operationSuccess, setOperationSuccess] = useState<
        string | undefined
    >();

    return (
        <PageTemplate
            heading="Issuable Assets Register"
            errorOccured={assets === null}
            isLoading={assets === undefined}
            successMessageBar={operationSuccess}
            setSuccessMessageBar={setOperationSuccess}
        >
            {assets && (
                <AssetList
                    assets={assets}
                    filteredCategory={filteredCategory}
                    setInventoryId={(inventoryId: string) =>
                        setSelectedInventoryId(inventoryId)
                    }
                />
            )}
            {selectedInventoryId && (
                <IssueReturnModal
                    inventoryId={selectedInventoryId}
                    purchaseRequestNumber={
                        location?.state?.purchaseRequestNumber
                    }
                    submittedBy={location?.state?.submittedBy}
                    issuedTo={location?.state?.associateName}
                    dismissPanel={(isSuccess) => {
                        if (isSuccess) {
                            setOperationSuccess("Successfully Updated");
                            setAssetsAPi();
                        }
                        setSelectedInventoryId(undefined);
                    }}
                />
            )}
        </PageTemplate>
    );
};

export default IssueReturnPage;
