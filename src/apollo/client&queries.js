import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

export const client = new ApolloClient({
  uri: "http://167.99.242.216:88/graphql"
});     


export const sizeQuery=gql`
  query {
    attributes{
      id
      title
      definition
      name
      tags
      values{
        id
        title
        value
      }
    }
  }
  `