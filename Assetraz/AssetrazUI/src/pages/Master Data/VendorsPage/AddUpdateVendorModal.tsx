import React, { useEffect, useState } from "react";
import { Stack } from "@fluentui/react";

import StyledModal, {
    ModalSize,
    StyleModalFooter,
} from "../../../components/common/StyledModal";
import { IVendor, VendorModalProps } from "../../../types/Vendor";
import { VendorContext } from "../../../Contexts/VendorDetailContext";

import {
    AddUpdateVendorModalBody,
    AddUpdateVendorModalFooter,
} from "./VendorModalComponents";
import { vendorModalBodyContainer } from "./VendorModalComponentsStyles";

const VendorModal: React.FC<VendorModalProps> = ({
    toggleShowModal,
    setSuccessMessage,
    getData,
    selectedVendor,
    isAddModal,
    setIsAddModal,
}) => {
    const [vendorDetail, setVendorDetail] = useState<IVendor | undefined>();
    const [initialVendorDetail, setInitialVendorDetail] = useState<
        IVendor | undefined
    >();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [dataEdited, setDataEdited] = useState<boolean>(false);

    useEffect(() => {
        if (selectedVendor && isAddModal === false) {
            setVendorDetail(selectedVendor);
            setInitialVendorDetail(selectedVendor);
        }
    }, [isAddModal, selectedVendor]);

    return (
        <VendorContext.Provider
            value={{ vendorDetail, setVendorDetail, initialVendorDetail }}
        >
            <StyledModal
                isLoading={isLoading}
                isOpen={true}
                onDismiss={() => {
                    toggleShowModal();
                    setIsAddModal && setIsAddModal(false);
                }}
                title={isAddModal ? "New Vendor" : "Edit Vendor"}
                errorMessageBar={errorMessage}
                setErrorMessageBar={setErrorMessage}
                size={ModalSize.Medium}
            >
                <Stack styles={vendorModalBodyContainer}>
                    <AddUpdateVendorModalBody
                        isAddModal={isAddModal}
                        setDataEdited={setDataEdited}
                    />
                    <StyleModalFooter>
                        <AddUpdateVendorModalFooter
                            closeModal={toggleShowModal}
                            setLoading={setLoading}
                            setErrorMessage={setErrorMessage}
                            setSuccessMessage={setSuccessMessage}
                            getData={getData}
                            isAddModal={isAddModal}
                            setIsAddModal={setIsAddModal}
                            dataEdited={dataEdited}
                        />
                    </StyleModalFooter>
                </Stack>
            </StyledModal>
        </VendorContext.Provider>
    );
};

export default VendorModal;
