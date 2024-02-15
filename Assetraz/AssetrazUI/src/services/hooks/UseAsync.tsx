import { useCallback, useEffect, useState } from "react";

export const useAsync = <T,>(
    asyncFunction: () => Promise<T>,
    immediate = true
) => {
    const [status, setStatus] = useState<
        "idle" | "pending" | "success" | "error"
    >("idle");
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<boolean>(false);

    const execute = useCallback(() => {
        setStatus("pending");
        setData(null);
        setError(false);
        return asyncFunction()
            .then((response: any) => {
                setData(response);
                setStatus("success");
            })
            .catch((error: any) => {
                setError(true);
                setStatus("error");
            });
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);
    return { execute, status, data, error };
};
