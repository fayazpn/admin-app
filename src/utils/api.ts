import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "./AppInterface";

export async function fetchUsers( page = 1, result = 25 ) {
  const response = await fetch(
    `https://randomuser.me/api?page=${page}&results=${result}`
  );
  const data = await response.json();
  const apiResponse: APIResponse = {
    results: data.results,
    info: data.info,
  };
  return apiResponse;
}

const useFetchData = (page: number, results: number) => {
  return useQuery(["fetchData", page, results], () => fetchUsers(page, results));
};

export default useFetchData;
