import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { AssetDetails } from "../types/Asset";
import { IDropdownOption } from "@fluentui/react";
import { NetworkCompany } from "../types/NetworkCompany";

export interface IUpdateAssetsContext {
  assets: AssetDetails[];
  setAssets: Dispatch<SetStateAction<AssetDetails[]>>
  filteredAssets: AssetDetails[]
  setFilteredAssets: Dispatch<SetStateAction<AssetDetails[]>>
  filterQuery: string
  setFilterQuery: Dispatch<SetStateAction<string>>
  errorMessage: string
  setErrorMessage: Dispatch<SetStateAction<string>>
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  selectedNetworkCompany?: IDropdownOption<NetworkCompany>
  setSelectedNetworkCompany: Dispatch<SetStateAction<IDropdownOption<NetworkCompany> | undefined>>
  networkCompanyOptions: IDropdownOption<NetworkCompany>[] | null
  setNetworkCompanyOptions: Dispatch<SetStateAction<IDropdownOption<NetworkCompany>[] | null>>
  GetAllAssetDetails: () => Promise<void>
}

export const UpdateAssetsContext = createContext<IUpdateAssetsContext|undefined>( {} as IUpdateAssetsContext);

export const UpdateAssetContextProvider = UpdateAssetsContext.Provider;
export const useUpdateAssetContext = () => useContext(UpdateAssetsContext);
