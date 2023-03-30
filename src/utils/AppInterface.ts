import { ReactNode } from "react";

export interface TableDataType {
  name: {
    title: string;
    first: string;
    last: string;
  };
  gender: string;
  email: string;
  phone: string;
  dob: {
    date: string;
    age: number;
  };
  nat: string;
  [key: string]: any; // Add index signature here
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export interface CountryValues {
  text: string;
  value:string;
}

export type DataIndex = keyof TableDataType

export interface APIResponse {
  results: TableDataType[];
  info: {
    seed: string;
    page: number;
    results: number;
    version: string;
  };
}

export interface TableState {
  searchText: string;
  searchedColumn: string;
  currentPage: number;
  pageSize: number;
}

export type Action =
  | { type: "SET_SEARCH_TEXT"; payload: string }
  | { type: "SET_SEARCHED_COLUMN"; payload: string }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number };

  export interface ThemeProviderProps {
    children: ReactNode;
  }
  
  export interface ThemeContextType {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  }