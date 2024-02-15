// eslint-disable-next-line react-hooks/rules-of-hooks
import  { createContext,  useContext, Dispatch, SetStateAction } from "react";
import IStockReceiptDocument from "../types/StockReceiptDocument";

export interface InvoiceRegisterContextType {
    invoices: IStockReceiptDocument[];
    filteredInvoices: IStockReceiptDocument[];
    selectedNetworkCompany: string;
    selectedStatus: string;
    filterQuery: string;
    setSelectedNetworkCompany: Dispatch<SetStateAction<string>>;
    setSelectedStatus: Dispatch<SetStateAction<string>>;
    setFilterQuery: Dispatch<SetStateAction<string>>;
    setFilteredInvoices: Dispatch<SetStateAction<IStockReceiptDocument[]>>;
}

const InvoiceRegisterContext = createContext<InvoiceRegisterContextType>({} as InvoiceRegisterContextType);

export const InvoiceRegisterContextProvider = InvoiceRegisterContext.Provider;
export const useInvoiceRegisterContext = () => useContext(InvoiceRegisterContext);

