// import React from "react";
// import { useQuery } from "react-query";
import axios from "axios";

// import { DataType, Table, useTable } from 'ka-table';
import { DataType, Table } from 'ka-table';
// import { QueryClient, QueryClientProvider } from 'react-query';
import { useQuery } from "react-query";
// import React, { useState } from 'react';
import React from 'react';

// import { ActionType } from 'ka-table/enums';

const retrieveBooks = async () => {
  const response = await axios.get(
    "http://pihome.local:5384/books",
  );
  return response.data;
};

const App = () => {
  const {
    data: books,
    error,
    isLoading,
  } = useQuery("bookData", retrieveBooks);

  if (isLoading) return <div>Fetching books...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  // Create a new array where each book has a modified 'series' property
  // const modifiedBooks = books?.map(book => ({
  //   ...book,
  //   series: book.series ? `${book.series} [${book.seriesIndex}]` : null,
  // })) || [];

  return (
    <div className='remote-data-demo'>
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
    </div>
  );
};

export default App;
