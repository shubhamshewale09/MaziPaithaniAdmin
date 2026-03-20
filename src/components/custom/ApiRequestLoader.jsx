import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { API_LOADER_EVENT } from "../../Utils/apiLoader";

const ApiRequestLoader = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLoaderChange = (event) => {
      setIsLoading(!!event.detail?.isLoading);
    };

    window.addEventListener(API_LOADER_EVENT, handleLoaderChange);

    return () => {
      window.removeEventListener(API_LOADER_EVENT, handleLoaderChange);
    };
  }, []);

  if (!isLoading) {
    return null;
  }

  return <Loader overlay fullScreen={false} message="Fetching latest data..." />;
};

export default ApiRequestLoader;
