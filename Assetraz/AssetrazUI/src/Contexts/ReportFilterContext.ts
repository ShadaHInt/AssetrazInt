import { IColumn } from "@fluentui/react";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { IFilterType } from "../pages/Reports/ReportComponents";

export interface IReportFilterContext {
    data: any[];
    columns: IColumn[];
    clear: boolean;
    resetFilter: () => void;
    setFilter: Dispatch<SetStateAction<IFilterType[]>>;
}

const ReportFilterContext = createContext({} as IReportFilterContext);
export const ReporFilterProvider = ReportFilterContext.Provider;
// eslint-disable-next-line react-hooks/rules-of-hooks
export const useReportContext = () => useContext(ReportFilterContext);
