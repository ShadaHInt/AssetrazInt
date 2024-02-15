export type Manufacturer = {
    manfacturerId: string;
    manufacturerName: string;
};

export interface IManufacturer {
    manfacturerId?: string;
    manufacturerName: string;
    preferredManufacturer: boolean;
    active: boolean;
}
