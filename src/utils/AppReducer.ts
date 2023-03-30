import { Action, TableState } from "./AppInterface";

export const initialState: TableState = {
  searchText: "",
  searchedColumn: "",
  currentPage: 1,
  pageSize: 200,
};

export function tableReducer(state: TableState, action: Action): TableState {
  switch (action.type) {
    case "SET_SEARCH_TEXT":
      return { ...state, searchText: action.payload };
    case "SET_SEARCHED_COLUMN":
      return { ...state, searchedColumn: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload };
    default:
      return state;
  }
}

