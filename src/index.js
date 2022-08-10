import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Pages from './pages';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { ChakraProvider } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'));
const httpLink = createHttpLink({
  uri: 'https://subgraph-ordercloud.herokuapp.com/',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = document.cookie.split(';').filter(c => c.includes('oc-saas-admin'))[0].split("=")[1];
  console.log(token)
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  uri: "https://subgraph-ordercloud.herokuapp.com/", // change to YOUR own production server
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  name: "web",
  version: "1.0",
});

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ApolloProvider client={client}>
        <Pages />
      </ApolloProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
