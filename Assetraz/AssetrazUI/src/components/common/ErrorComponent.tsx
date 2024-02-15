import { Text, mergeStyleSets, Stack } from "@fluentui/react";

const componentStyle = mergeStyleSets({
    root: {
        textAlign: "center",
    },
});

const ErrorComponent = () => (
    <Stack horizontalAlign="center" verticalAlign="center">
        <Text variant="xLarge" className={componentStyle.root}>
            Something Went wrong
        </Text>
    </Stack>
);

export default ErrorComponent;
