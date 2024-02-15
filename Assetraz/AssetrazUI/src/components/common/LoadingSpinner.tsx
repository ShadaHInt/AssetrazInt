import { mergeStyleSets, Spinner, SpinnerSize } from "@fluentui/react";

export const spinnerStyle = mergeStyleSets({
    spinner: {
        margin: "auto",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: "absolute",
    },
});

const LoadingSpinner = () => {
    return (
        <div>
            <Spinner
                size={SpinnerSize.large}
                label="Loading... Please wait!"
                className={spinnerStyle.spinner}
            />
        </div>
    );
};

export default LoadingSpinner;
