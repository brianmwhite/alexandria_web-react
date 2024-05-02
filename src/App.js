import axios from "axios";
import { DataType, Table } from 'ka-table';
import { useQuery } from "react-query";
import React, { useState, useRef, useEffect } from 'react';
import "./App.css";

const retrieveBooks = async (page, limit, search) => {
  const response = await axios.get(
    `http://pihome.local:5384/books?page=${page}&limit=${limit}&search=${search}`,
  );
  return response.data;
};

const App = () => {
  const [paging, setPaging] = useState({ currentPage: 1, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const {
    data: books,
    error,
    isLoading,
  } = useQuery(["bookData", paging.currentPage, paging.pageSize, search],
    ({ queryKey }) => {
      const [, page, limit, search] = queryKey;
      return retrieveBooks(page, limit, search);
    });

  if (isLoading) return <div>Fetching books...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const onInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const onSearchSubmit = (event) => {
    event.preventDefault();
    setSearch(inputValue);
    setPaging({ currentPage: 1, pageSize: paging.pageSize });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onFirstPage = () => {
    setPaging(prev => ({ ...prev, currentPage: 1 }));
  };

  const onNextPage = () => {
    setPaging(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
  };

  const onPreviousPage = () => {
    setPaging(prev => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }));
  };

  const onPageSizeChange = (event) => {
    setPaging({ currentPage: 1, pageSize: Number(event.target.value) });
  };

  return (
    <div className='bookTable'>
      <form onSubmit={onSearchSubmit}>
        <input ref={inputRef} className="search-input" type="text" value={inputValue} onChange={onInputChange} placeholder="Search..." />
        <button className="search-button" type="submit">Search</button>
      </form>
      <Table
        columns={[
          { key: 'title', title: 'Title', dataType: DataType.String },
          { key: 'authors', title: 'Authors', dataType: DataType.String },
          { key: 'seriesInfo', title: 'Series', dataType: DataType.String },
        ]}
        data={books || []}
        loading={{
          enabled: isLoading
        }}
        rowKeyField={'id'}
      />
      <button className="pagination-control" onClick={onFirstPage}>First</button>
      <button className="pagination-control" onClick={onPreviousPage}>Previous</button>
      <button className="pagination-control" onClick={onNextPage}>Next</button>
      <select className="pagination-control" value={paging.pageSize} onChange={onPageSizeChange}>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
      </select>
    </div>
  );
};

export default App;
