import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";

import "./index.css";
import 'ka-table/style.scss';
import './style.scss';
import App from "./App";

const queryClient = new QueryClient();

const root = document.getElementById("root");
const rootContainer = ReactDOM.createRoot(root);

rootContainer.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);