import { useEffect, useState } from "react";

const useService = <T>(service: Function) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<T[]>();
    const [errorOccured, setErrorOccured] = useState<boolean>(false);
    const [refetch, setRefetch] = useState({});

    const refresh = () => setRefetch({});

    useEffect(() => {
        setIsLoading(true);
        service()
            .then((res: T[]) => {
                setIsLoading(false);
                res && setData(res);
            })
            .catch((err: string) => {
                setIsLoading(false);
                setErrorOccured(true);
            });
    }, [service, refetch]);

    return { isLoading, data, errorOccured, refresh, setData, setIsLoading };
};
export default useService;
