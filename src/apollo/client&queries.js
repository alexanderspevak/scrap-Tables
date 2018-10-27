import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

export const client = new ApolloClient({
  uri: "http://46.101.199.39:88/graphql"
});     


export const client2=new ApolloClient({
  uri:"http://46.101.199.39:90/graphql"
})

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

  export const attributesQuery=gql`
  query {
    categories{
      id
      title
      parentCategory{
        id
      }
    }
  }`