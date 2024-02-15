import React from "react";
export type Vendor = {
    vendorId: string;
    vendorName: string;
};

export interface IVendor {
    vendorId: string;
    vendorName: string;
    vendorAddressLine1: string;
    vendorAddressLine2?: string;
    city: string;
    state: string ;
    country: string;
    gstin?: string;
    preferredVendor: boolean;
    contactPerson: string;
    contactNumber: string ;
    emailAddress: string;
    createdDate: Date;
    createdBy: string;
    updatedDate: Date;
    updatedBy: string;
    active?: boolean;
}

export type VendorModalProps = {
    toggleShowModal: () => void;
    successMessage?: string;
    setSuccessMessage: (message: string | undefined) => void;
    getData: () => void;
    selectedVendor?: IVendor | undefined;
    isAddModal?: boolean;
    setIsAddModal?: React.Dispatch<React.SetStateAction<boolean>>;
};

export type AddVendorModalFooterProps = {
    closeModal: () => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorMessage: (message: string | undefined) => void;
    setSuccessMessage: (message: string | undefined) => void;
    getData: () => void;
    setIsAddModal?: React.Dispatch<React.SetStateAction<boolean>>;
    dataEdited?: boolean;
    isAddModal?: boolean;
};

export type AddVendorModalBodyProps = {
    isAddModal?: boolean;
    setDataEdited: React.Dispatch<React.SetStateAction<boolean>>;
};
