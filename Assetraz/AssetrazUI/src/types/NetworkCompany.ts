export type NetworkCompany = {
    networkCompanyId: string;
    companyName: string;
    isPrimary: boolean;
};

export type NetworkCompanyOption = {
    key: string;
    text: string;
    isPrimary: boolean;
};

export type NetworkCompanyOptionTwo = {
    label: string;
    value: string;
};

export interface INetworkCompany {
    networkCompanyId: string;
    companyName: string;
    companyAddressLine1: string;
    companyAddressLine2?: string;
    city: string;
    state: string;
    country: string;
    contactNumber: string;
    isPrimary: boolean;
}

export interface INetworkCompanyModal {
    networkCompanySelected: any;
    dismissPanel: (value: boolean, message?: string) => void;
}
