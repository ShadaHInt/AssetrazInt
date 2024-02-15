import {
    Callout,
    DirectionalHint,
    FontWeights,
    mergeStyleSets,
    Text,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { FC } from "react";

interface ICalloutProps {
    buttonId: string;
    isCalloutVisible: boolean;
    toggleIsCalloutVisible: () => void;
    title?: string;
}
const styles = mergeStyleSets({
    callout: {
        width: 320,
        padding: "20px 24px",
    },
    title: {
        title: {
            marginBottom: 12,
            fontWeight: FontWeights.semilight,
        },
    },
});

const StyledCallout: FC<ICalloutProps> = (props) => {
    const {
        isCalloutVisible,
        buttonId,
        children,
        title,
        toggleIsCalloutVisible,
    } = props;

    const labelId = useId("callout-label");
    const descriptionId = useId("callout-label");
    const content = (
        <>
            {title && (
                <Text
                    block
                    variant="xLarge"
                    className={styles.title}
                    id={labelId}
                >
                    {title}
                </Text>
            )}
            <Text block variant="small" id={descriptionId}>
                {children}
            </Text>
        </>
    );

    return (
        <>
            {isCalloutVisible ? (
                <Callout
                    role="dialog"
                    className={styles.callout}
                    gapSpace={1}
                    target={`#${buttonId}`}
                    isBeakVisible={true}
                    beakWidth={10}
                    onDismiss={toggleIsCalloutVisible}
                    directionalHint={DirectionalHint.bottomCenter}
                    setInitialFocus
                >
                    {content}
                </Callout>
            ) : null}
        </>
    );
};

export default StyledCallout;
