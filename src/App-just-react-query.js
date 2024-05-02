import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

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

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
};

export default App;

