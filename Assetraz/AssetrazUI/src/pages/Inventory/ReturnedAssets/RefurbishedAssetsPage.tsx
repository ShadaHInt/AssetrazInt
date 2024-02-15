import { useState } from "react";
import PageTemplate from "../../../components/common/PageTemplate";
import { RefurbishedAssetList } from "./RefurbishedAssetList";
import RefurbishedAssetModal from "../../../components/refurbished-asset/RefurbishedAssetModal";
import {
    IReturnedContext,
    useReturnAssetContext,
} from "../../../Contexts/ReturnedAssetContext";

const RefurbishedAssetsPage = ({ setAssetsAPi }: any) => {
    const { refurbishedAssets, errorMessage, setErrorMessage } =
        useReturnAssetContext() as IReturnedContext;
    const [selectedRefurbishedAssetId, setSelectedRefurbishedAssetId] =
        useState<string | undefined>();
    const [selectedAssetId, setSelectedAssetId] = useState<
        string | undefined
        >();

    const [operationSuccess, setOperationSuccess] = useState<
        string | undefined
    >();

    return (
        <PageTemplate
            heading="Returned Assets"
            errorOccured={refurbishedAssets === null}
            isLoading={
                refurbishedAssets === undefined && errorMessage === undefined
            }
            errorMessage={errorMessage}
            successMessageBar={operationSuccess}
            setSuccessMessageBar={setOperationSuccess}
            clearErrorMessage={() => setErrorMessage("")}
        >
            {refurbishedAssets && (
                <RefurbishedAssetList
                    assets={refurbishedAssets}
                    setRefurbishedAssetId={(refurbishedAssetId: string) =>
                        setSelectedRefurbishedAssetId(refurbishedAssetId)
                    }
                    setAssetId={(assetId: string) => {
                        setSelectedAssetId(assetId);
                    }}
                />
            )}

            {selectedRefurbishedAssetId && (
                <RefurbishedAssetModal
                    refurbishedAssetId={selectedRefurbishedAssetId}
                    selectedAssetId={selectedAssetId}
                    dismissPanel={(isSuccess) => {
                        if (isSuccess) {
                            setOperationSuccess("Successfully Updated");
                            setAssetsAPi();
                        }
                        setSelectedRefurbishedAssetId(undefined);
                    }}
                />
            )}
        </PageTemplate>
    );
};

export default RefurbishedAssetsPage;
