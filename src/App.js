import axios from "axios";
import { DataType, Table } from 'ka-table';
import { useQuery } from "react-query";
import React, { useState, useRef, useEffect } from 'react';
import "./App.css";

const retrieveBooks = async (page, limit, search) => {
  const response = await axios.get(
    `https://books.internal.thirdember.com/api/books?page=${page}&limit=${limit}&search=${search}`,
  );
  return response.data;
};

const App = () => {
  const [paging, setPaging] = useState({ currentPage: 1, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [seriesId, setSeriesId] = useState(null);

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
  } = useQuery(["bookData", paging.currentPage, paging.pageSize, search, seriesId],
    ({ queryKey }) => {
      const [, page, limit, search, seriesId] = queryKey;
      const url = seriesId
        ? `https://books.internal.thirdember.com/api/Books/series/${seriesId}?page=${page}&limit=${limit}`
        : `https://books.internal.thirdember.com/api/books?page=${page}&limit=${limit}&search=${search}`;
      return axios.get(url).then(response => response.data);
    });

  if (isLoading) return <div>Fetching books...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const onInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const updateSeriesId = (id) => {
    setSeriesId(id);
    setPaging({ currentPage: 1, pageSize: paging.pageSize });
  };

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

  const onClearSearch = () => {
    setInputValue('');
    setSearch('');
    setSeriesId(null);
    setPaging({ currentPage: 1, pageSize: 10 });
  };

  const SeriesLink = ({ value, text, updateSeriesId }) => (
    <button className="series-link" onClick={() => updateSeriesId(value)}>
      {text}
    </button>
  );

  return (
    <div className='bookTable'>
      <form onSubmit={onSearchSubmit}>
        <input ref={inputRef} className="search-input" type="text" value={inputValue} onChange={onInputChange} placeholder="Search..." />
        <button className="search-button" type="submit">Search</button>
        <button className="clear-button" type="button" onClick={onClearSearch}>Clear</button>
      </form>
      <Table
        columns={[
          { key: 'title', title: 'Title', dataType: DataType.String },
          { key: 'authors', title: 'Authors', dataType: DataType.String },
          {
            key: 'seriesFilter',
            title: 'Series'
          }
        ]}
        data={books || []}
        loading={{
          enabled: isLoading
        }}
        rowKeyField={'id'}
        childComponents={{
          cellText: {
            content: (props) => {
              switch (props.column.key) {
                case 'seriesFilter': return <SeriesLink value={props.rowData.seriesId} text={props.rowData.seriesInfo} updateSeriesId={updateSeriesId} />;
                default: return null;
              }
            }
          }
        }}
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
