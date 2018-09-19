
////sheet not needed at the moment


import {ApolloClient, HttpLink , InMemoryCache, ApolloLink} from 'apollo-boost';
import {withClientState} from 'apollo-link-state';


const cache=new InMemoryCache({
  });

  const defaultState={
    images:{
      __typename:'Images',
      Images:[]
    },

  }

  const stateLink=withClientState({
    cache,
    defaults:defaultState,
    resolvers:{
      Mutation:{
        updateImages:(_,variables,{cache})=>{
          var query=gql`
          query{
            orderItems @client{
              orderItems
            }
          }
            `;
          const newItem=variables.input;
          const previousState=cache.readQuery({query});    
            const data={
              ...previousState,
                images:{
                ...previousState.images,
                 images:[...previousState.images.images,newItem]
              }  
             }
             cache.writeQuery({query,data})
             return null;
        },
      },
    },
  })
  export const client = new ApolloClient({
      link: ApolloLink.from([
        stateLink,
        new HttpLink({uri: endpointURL})
      ]),
      cache
  
    });