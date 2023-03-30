import React, { useMemo, useReducer, useRef, useState } from "react";
import { Input, InputRef, Pagination, TableProps } from "antd";
import { Button, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table/interface";
import { DataIndex, TableDataType } from "../utils/AppInterface";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { countryFilterData, PAGE_SIZE_OPTIONS } from "../utils/data";
import Highlighter from "react-highlight-words";
import useFetchData from "../utils/api";
import { initialState, tableReducer } from "../utils/AppReducer";

const AdminTable: React.FC = () => {
  const searchInput = useRef<InputRef>(null);
  const [tableState, dispatch] = useReducer(tableReducer, initialState);

  // Query to fetch data
  const { isLoading, error, data } = useFetchData(
    tableState.currentPage,
    tableState.pageSize
  );

  // Filter and search functions of columns
  const getColumnSearchProps = (
    dataIndex: DataIndex,
    placeHolder: string
  ): ColumnType<TableDataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${placeHolder}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(
              selectedKeys as string[],
              confirm,
              dataIndex.toString()
            )
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex.toString())
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              dispatch({
                type: "SET_SEARCH_TEXT",
                payload: (selectedKeys as string[])[0],
              });
              dispatch({
                type: "SET_SEARCHED_COLUMN",
                payload: dataIndex.toString(),
              });
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      dataIndex.toString().includes(".")
        ? record[dataIndex.toString().split(".")[0]][
            dataIndex.toString().split(".")[1]
          ]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase())
        : record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      tableState.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[tableState.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Column data, Memoize it so it is not calculated on re-renders
  const columns =  useMemo<ColumnsType<TableDataType>>(() =>[
    {
      title: "First Name",
      dataIndex: ["name", "first"],

      sorter: (a, b) => a.name.first.localeCompare(b.name.first),
      ...getColumnSearchProps("name.first" as DataIndex, "First Name"),
      render: (_, record) => <span>{record.name.first}</span>,
    },
    {
      title: "Last Name",
      dataIndex: ["name", "last"],
      sorter: (a, b) => a.name.last.localeCompare(b.name.last),
      ...getColumnSearchProps("name.last" as DataIndex, "Last Name"),
      responsive: ["lg"],
      render: (_, record) => <span>{record.name.last}</span>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      sortDirections: ["descend", "ascend"],
      filters: [
        {
          text: "Male",
          value: "male",
        },
        {
          text: "Female",
          value: "female",
        },
      ],
      onFilter: (value, record) => record.gender.startsWith(value.toString()),
      filterSearch: true,
      responsive: ["xl"],
      render: (_, record) => (
        <span>{record.gender === "male" ? "M" : "F"}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",

      ...getColumnSearchProps("email", "Email"),
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      responsive: ["sm"],
      ...getColumnSearchProps("phone", "Phone"),
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Date of Birth",
      dataIndex: ["dob", "date"],

      ...getColumnSearchProps("dob.date" as DataIndex, "Date of Birth"),
      sorter: (a, b) => a.dob.date.localeCompare(b.dob.date),
      responsive: ["md"],
      render: (_, record) => (
        <span>{moment(record.dob.date).format("YYYY-MM-DD")}</span>
      ),
    },
    {
      title: "Age",
      dataIndex: ["dob", "age"],
      sorter: (a, b) => a.dob.age - b.dob.age,
      sortDirections: ["descend", "ascend"],
      responsive: ["xl"],
    },
    {
      title: "Nationality",
      dataIndex: "nat",
      sorter: (a, b) => a.nat.localeCompare(b.nat),
      sortDirections: ["descend", "ascend"],
      filters: [...countryFilterData],
      onFilter: (value, record) => record.nat.startsWith(value.toString()),
      responsive: ["lg"],
      filterSearch: true,
    },
  ], []);

  // Example of how to use the state and dispatch
  const handleSearch = (
    selectedKeys: React.Key[],
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm();
    dispatch({ type: "SET_SEARCH_TEXT", payload: selectedKeys[0] as string });
    dispatch({ type: "SET_SEARCHED_COLUMN", payload: dataIndex });
  };

  // Filter reset handler
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    dispatch({ type: "SET_SEARCHED_COLUMN", payload: "" });
  };

  // Function to handle page change
  const handlePageChange = (page: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  // Function to handle page size change
  const handlePageSizeChange = (current: number, size: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); // Reset to first page
    dispatch({ type: "SET_PAGE_SIZE", payload: size });
  };

  return (
    <div>
      <Table
        className="w-full mt-5"
        scroll={{ y: `calc(100vh - 270px)` }}
        columns={columns}
        dataSource={data?.results}
        loading={isLoading}
        rowKey={(record) => record.email}
        pagination={{
          current: tableState.currentPage,
          pageSize: tableState.pageSize,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: handlePageChange,
          onShowSizeChange: handlePageSizeChange,
          total: 30000,
        }}
      />
    </div>
  );
};

export default React.memo(AdminTable);
