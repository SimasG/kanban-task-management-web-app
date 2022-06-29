const useFetchLocalStorageData = () => {
  if (typeof window !== undefined) {
    const data = JSON.parse(localStorage?.getItem("boards") || "");
    return data;
  }
};

export default useFetchLocalStorageData;
