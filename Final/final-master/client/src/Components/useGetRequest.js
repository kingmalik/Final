import React, { useEffect, useState } from "react";

const useGetRequest = (path) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const abortController = new AbortController();

        fetch(path, { signal: abortController.signal })
            .then((body) => {
                if (!body.ok) {
                    console.log("error");

                    throw Error("Cannot get data from API - Request Failed.");
                }

                return body.json();
            })
            .then((list) => {
                setData(list);
                setIsLoading(false);
                setErrorMessage("");
            })
            .catch((e) => {
                if (e.name !== "AbortError") {
                    setErrorMessage(e.message);
                    setData([]);
                    setIsLoading(false);
                }
            });

        return () => abortController.abort();
    }, [path]);

    return { data, isLoading, errorMessage };
};

export default useGetRequest;