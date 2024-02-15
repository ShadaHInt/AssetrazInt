import React, { useEffect, useState } from "react";
import {
    DefaultButton,
    IDropdownOption,
    Spinner,
    SpinnerSize,
    Stack,
} from "@fluentui/react";

import { Category } from "../../../types/Category";
import { NetworkCompany } from "../../../types/NetworkCompany";
import { GetAllCategories } from "../../../services/categoryService";
import { GetAllNetworkCompanies } from "../../../services/networkCompanyService";
import { SearchableDropdown } from "../../../components/common/SearchableDropdown";
import { addDashboardPreferences } from "../../../services/DashboardPreferenceService";
import { PreferenceType } from "./PreferenceTypes";
import { PREFERENCE_MAX_LENGTH } from "./PreferenceConstants";
import {
    addIcon,
    dropdownStyles,
    preferenceHeaderContainer,
} from "./PreferenceChartStyles";

interface SetPreferenceHeaderProps {
    setSuccessMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    getData: () => void;
    preferenceLength: number;
    data: PreferenceType[] | undefined;
}

export const SetPreferenceHeader: React.FC<SetPreferenceHeaderProps> = ({
    setSuccessMessage,
    setErrorMessage,
    getData,
    preferenceLength,
    data,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<
        IDropdownOption<Category>[] | null
    >([]);
    const [networkCompany, setNetworkCompany] = useState<
        IDropdownOption<NetworkCompany>[] | null
    >([]);

    const [selectedNetworkCompany, setSelectedNetworkCompany] =
        useState<string>();
    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >();

    useEffect(() => {
        const GetCategoriesAndNetworkCompanies = async () => {
            try {
                const [categoriesRes, networkCompaniesRes] = await Promise.all([
                    GetAllCategories(),
                    GetAllNetworkCompanies(),
                ]);

                setCategories(categoriesRes);
                setNetworkCompany(networkCompaniesRes);
            } catch (err) {
                setErrorMessage(err as string);
                setCategories([]);
                setNetworkCompany([]);
            }
        };

        GetCategoriesAndNetworkCompanies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const AddPreferences = async () => {
        const requestData = {
            networkCompanyId: selectedNetworkCompany,
            categoryId: selectedCategory,
        } as PreferenceType;

        const combinationExists = data?.some(
            (item: any) =>
                item.networkCompanyId === requestData.networkCompanyId &&
                item.categoryId === requestData.categoryId
        );

        if (combinationExists) {
            setErrorMessage("Selected preference already exists!");
            return;
        }

        if (!selectedCategory || !selectedNetworkCompany) {
            setErrorMessage(
                "Please select both network company and category to add preference."
            );
            return;
        }

        if (preferenceLength >= PREFERENCE_MAX_LENGTH) {
            setErrorMessage("Cannot add more than eight preferences!");
            return;
        } else {
            try {
                setIsLoading(true);
                var newPreference = await addDashboardPreferences(requestData);
                if (newPreference) {
                    setSuccessMessage("New preference added successfully!");
                    setSelectedNetworkCompany(undefined);
                    setSelectedCategory(undefined);
                    getData();
                }
            } catch (error) {
                setErrorMessage(error as string);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Stack
            style={preferenceHeaderContainer}
            horizontal
            tokens={{ childrenGap: 20 }}
        >
            <SearchableDropdown
                placeholder="Select network company"
                options={networkCompany ?? []}
                selectedKey={selectedNetworkCompany ?? null}
                onChange={(e, item) =>
                    setSelectedNetworkCompany(item?.key as string)
                }
                styles={dropdownStyles}
            />
            <SearchableDropdown
                placeholder="Select Category"
                options={categories ?? []}
                selectedKey={selectedCategory ?? null}
                onChange={(e, item) => setSelectedCategory(item?.key as string)}
                styles={dropdownStyles}
            />

            <DefaultButton
                primary
                iconProps={addIcon}
                onClick={AddPreferences}
                disabled={isLoading}
                style={{ width: 210 }}
            >
                {!isLoading ? (
                    "Add Preference"
                ) : (
                    <>
                        Adding Preference
                        <Spinner
                            size={SpinnerSize.xSmall}
                            style={{ marginLeft: "5px" }}
                        />
                    </>
                )}
            </DefaultButton>
        </Stack>
    );
};
