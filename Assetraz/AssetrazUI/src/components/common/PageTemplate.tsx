import { Stack, Text } from "@fluentui/react";
import { FunctionComponent, ReactNode, useEffect } from "react";
import ErrorComponent from "./ErrorComponent";
import LoadingSpinner from "./LoadingSpinner";
import { SuccessMessageBar } from "./MessageBar";
import { ErrorMessageBar } from "./MessageBar";
interface IPageProps {
    heading?: string;
    isLoading?: boolean;
    successMessageBar?: string;
    errorOccured?: boolean;
    headerElementRight?: ReactNode;
    errorMessage?: string;
    clearErrorMessage?: () => void;
    setSuccessMessageBar?: (value: string | undefined) => void;
}

const PageTemplate: FunctionComponent<IPageProps> = (props) => {
    const {
        children,
        isLoading,
        heading,
        successMessageBar,
        errorOccured,
        headerElementRight,
        errorMessage,
        clearErrorMessage,
        setSuccessMessageBar,
    } = props;

    useEffect(() => {
        let timer = setTimeout(() => {
            setSuccessMessageBar && setSuccessMessageBar("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMessageBar, setSuccessMessageBar]);

    if (errorOccured) {
        return <ErrorComponent />;
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Stack
            styles={{
                root: {
                    marginLeft: 16,
                    marginTop: 16,
                    position: "relative",
                },
            }}
        >
            <Stack
                horizontal
                horizontalAlign="space-between"
                style={{ marginBottom: 16 }}
            >
                <Stack.Item>
                    <Text variant="xLarge">{heading}</Text>
                </Stack.Item>
                <Stack.Item>
                    {headerElementRight && headerElementRight}
                </Stack.Item>
            </Stack>
            <Stack horizontalAlign="center" verticalFill>
                {successMessageBar && (
                    <SuccessMessageBar content={successMessageBar} />
                )}
                {errorMessage && (
                    <ErrorMessageBar
                        content={errorMessage}
                        onDismiss={clearErrorMessage}
                    />
                )}
                {children}
            </Stack>
        </Stack>
    );
};

export default PageTemplate;
