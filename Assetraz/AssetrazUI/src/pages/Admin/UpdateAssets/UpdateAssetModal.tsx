import { FC, useCallback, useEffect, useState } from "react";
import StyledModal, {
    ModalSize,
    StyleModalFooter,
} from "../../../components/common/StyledModal";
import { AssetDetails } from "../../../types/Asset";
import {
    DefaultButton,
    PrimaryButton,
    Separator,
    Stack,
    StackItem,
    TextField,
} from "@fluentui/react";
import {
    buttonStyles,
    inlineInputStyle,
} from "../UserRequestsPage/UserRequestPage.styles";
import { GetCategories } from "../../../services/categoryService";
import { UpdateAssetModalBody } from "./UpdateAssetModalBody";
import { deepEqual } from "../AssignedRoles/AssignedRolesModalHelperFunctions";
import { UpdateAssetDetails } from "../../../services/assetService";
import {
    IUpdateAssetsContext,
    useUpdateAssetContext,
} from "../../../Contexts/UpdateAssetsContext";
import { CategoryFieldRequired } from "../../Inventory/InvoiceRegister/helperFunctions";
import { assetTagRegex, specialCharacterRegex } from "./UpdateAssetConstants";

interface IUpdateAssetProps {
    isModalOpen: boolean;
    selectedAsset?: AssetDetails;
    closeModal: (isSuccess?: boolean) => void;
}

export const UpdateAssetModal: FC<IUpdateAssetProps> = ({
    isModalOpen,
    selectedAsset,
    closeModal,
}) => {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [updatedAsset, setUpdateddAsset] = useState<AssetDetails | undefined>(
        selectedAsset
    );
    const [categories, setCategories] = useState<any[] | []>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { GetAllAssetDetails } =
        useUpdateAssetContext() as IUpdateAssetsContext;

    useEffect(() => {
        GetCategories()
            .then((categoryResp) => {
                setCategories(categoryResp);
            })
            .catch(() => {
                setCategories([]);
            });
    }, []);

    const saveAsset = async () => {
        let isNotValid: boolean =
            specialCharacterRegex.test(updatedAsset?.serialNumber ?? "") ||
            specialCharacterRegex.test(updatedAsset?.assetTagNumber ?? "") ||
            specialCharacterRegex.test(updatedAsset?.modelNumber ?? "") ||
            assetTagRegex.test(updatedAsset?.assetTagNumber ?? "");

        setIsLoading(true);
        if (isNotValid) {
            setErrorMessage("Please provide a valid input");
        }
        try {
            if (updatedAsset && !isNotValid) {
                const response = await UpdateAssetDetails(updatedAsset);
                if (response) {
                    closeModal(true);
                    GetAllAssetDetails();
                }
            }
        } catch (err: any) {
            setErrorMessage(err);
        } finally {
            setIsLoading(false);
        }
    };

    const isDisabled = useCallback((): boolean => {
        let isDisabled: boolean =
            selectedAsset && updatedAsset
                ? (CategoryFieldRequired(
                      updatedAsset?.categoryName,
                      categories,
                      "Warranty"
                  ) &&
                      !updatedAsset.warrantyDate) ||
                  (CategoryFieldRequired(
                      updatedAsset?.categoryName,
                      categories,
                      "AssetTagNumber"
                  ) &&
                      !updatedAsset?.assetTagNumber) ||
                  (CategoryFieldRequired(
                      updatedAsset?.categoryName,
                      categories,
                      "SerialNumber"
                  ) &&
                      !updatedAsset?.serialNumber) ||
                  deepEqual(selectedAsset, updatedAsset)
                : false;
        return isDisabled;
    }, [categories, selectedAsset, updatedAsset]);

    const Footer = () => {
        return (
            <Stack horizontal horizontalAlign="end">
                <Stack horizontal>
                    <DefaultButton
                        styles={buttonStyles}
                        onClick={() => closeModal()}
                        text="Cancel"
                    />
                    <PrimaryButton
                        styles={buttonStyles}
                        onClick={() => saveAsset()}
                        text="Save"
                        disabled={isDisabled()}
                    />
                </Stack>
            </Stack>
        );
    };

    return (
        <StyledModal
            title={"Edit Asset Details"}
            isOpen={isModalOpen}
            onDismiss={() => closeModal()}
            isLoading={isLoading}
            errorMessageBar={errorMessage}
            setErrorMessageBar={() => setErrorMessage("")}
            size={ModalSize.Medium}
        >
            <Stack>
                <Stack>
                    <StackItem style={{ width: 220, marginTop: 5 }}>
                        <TextField
                            label="Category:"
                            readOnly={true}
                            value={selectedAsset?.categoryName}
                            styles={inlineInputStyle}
                            borderless
                        />
                    </StackItem>
                    <StackItem style={{ width: 220, marginTop: 5 }}>
                        <TextField
                            label="Manufacturer:"
                            readOnly={true}
                            value={selectedAsset?.manufacturerName}
                            styles={inlineInputStyle}
                            borderless
                        />
                    </StackItem>
                    <StackItem style={{ width: 220, marginTop: 5 }}>
                        <TextField
                            label="Network Company:"
                            readOnly={true}
                            value={selectedAsset?.networkCompanyName}
                            styles={inlineInputStyle}
                            borderless
                        />
                    </StackItem>
                </Stack>
                <Separator />
                <Stack>
                    <UpdateAssetModalBody
                        updateddAsset={updatedAsset}
                        setUpdateddAsset={setUpdateddAsset}
                        categories={categories}
                    />
                </Stack>
                <StyleModalFooter>
                    <Footer />
                </StyleModalFooter>
            </Stack>
        </StyledModal>
    );
};
