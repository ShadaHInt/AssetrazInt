import {
    FontWeights,
    getTheme,
    IconButton,
    IIconProps,
    mergeStyleSets,
    Modal,
    Separator,
} from "@fluentui/react";
import { FC, useEffect } from "react";
import ErrorComponent from "./ErrorComponent";
import LoadingSpinner from "./LoadingSpinner";
import { ErrorMessageBar, SuccessMessageBar } from "./MessageBar";

export const ModalSize = {
    Medium: 50,
    Large: 80,
    Small: 45,
    Line: "Line",
} as const;

type ModalSizes = typeof ModalSize[keyof typeof ModalSize];

interface IModalProps {
    isOpen: boolean;
    title: string;
    secondaryTitle?: string;
    isLoading?: boolean;
    errorMessageBar?: string;
    successMessageBar?: string;
    errorOccured?: boolean;
    size?: ModalSizes;
    onDismiss: () => void;
    setErrorMessageBar?: (value: string | undefined) => void;
    setSuccessMessageBar?: (value: string | undefined) => void;
}

const cancelIcon: IIconProps = { iconName: "Cancel" };
const theme = getTheme();

const iconButtonStyles = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: "auto",
        marginTop: "4px",
        marginRight: "2px",
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};

const contentStyles = mergeStyleSets({
    container80: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch",
        width: "80%",
        minHeight: "80%",
    },
    container50: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch",
        width: "50%",
        minHeight: "80%",
    },
    containerLine: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch",
        width: "80%",
        height: "45%",
    },
    containerSmall: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch",
        width: "50%",
        height: "45%",
    },

    secondaryheader: [
        theme.fonts.xLargePlus,
        {
            flex: "1 1 auto",
            color: theme.palette.neutralPrimary,
            display: "flex",
            alignItems: "center",
            fontWeight: FontWeights.semibold,
            fontSize: "20px",
            padding: "0px 12px 14px 24px",
        },
    ],
    header: [
        theme.fonts.xLargePlus,
        {
            flex: "1 1 auto",
            borderTop: `4px solid ${theme.palette.themePrimary}`,
            color: theme.palette.neutralPrimary,
            display: "flex",
            alignItems: "center",
            fontWeight: FontWeights.semibold,
            padding: "12px 12px 14px 24px",
        },
    ],
    body: {
        flex: "4 4 auto",
        padding: "0 24px 24px 24px",
        selectors: {
            p: { margin: "14px 0" },
            "p:first-child": { marginTop: 0 },
            "p:last-child": { marginBottom: 0 },
        },
    },
    footer: {
        position: "absolute",
        bottom: 0,
        minWidth: "95%",
        paddingBottom: "22px",
    },
});

export const StyleModalFooter: FC = (props) => {
    return (
        <div className={contentStyles.footer}>
            <Separator />
            {props.children}
        </div>
    );
};

const StyledModal: FC<IModalProps> = (props) => {
    const {
        children,
        isOpen,
        onDismiss,
        title,
        secondaryTitle,
        isLoading,
        errorMessageBar,
        successMessageBar,
        size,
        errorOccured,
        setErrorMessageBar,
        setSuccessMessageBar,
    } = props;

    useEffect(() => {
        let timer = setTimeout(() => {
            setSuccessMessageBar && setSuccessMessageBar(undefined);
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMessageBar]);

    let containerClassName = "";

    switch (size) {
        case ModalSize.Medium:
            containerClassName = contentStyles.container50;
            break;
        case ModalSize.Line:
            containerClassName = contentStyles.containerLine;
            break;
        case ModalSize.Small:
            containerClassName = contentStyles.containerSmall;
            break;
        default:
            containerClassName = contentStyles.container80;
    }
    return (
        <Modal
            titleAriaId="title"
            isOpen={isOpen}
            onDismiss={onDismiss}
            containerClassName={containerClassName}
            isBlocking={true}
        >
            <div className={contentStyles.header}>
                <span id="title">{title}</span>
                <IconButton
                    styles={iconButtonStyles}
                    iconProps={cancelIcon}
                    onClick={onDismiss}
                />
            </div>
            {secondaryTitle && (
                <div className={contentStyles.secondaryheader}>
                    <span id="title">{secondaryTitle}</span>
                </div>
            )}

            <Separator />
            {errorOccured ? (
                <ErrorComponent />
            ) : (
                <div className={contentStyles.body}>
                    {errorMessageBar && (
                        <ErrorMessageBar
                            content={errorMessageBar}
                            onDismiss={() =>
                                setErrorMessageBar &&
                                setErrorMessageBar(undefined)
                            }
                        />
                    )}
                    {successMessageBar && (
                        <SuccessMessageBar content={successMessageBar} />
                    )}
                    {isLoading ? <LoadingSpinner /> : children}
                </div>
            )}
        </Modal>
    );
};

export default StyledModal;
