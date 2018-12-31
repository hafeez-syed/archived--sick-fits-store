import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

import Item from "../components/Item";

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      description
      image
      price
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemList = styled.div`
  display: grid;
  grid-auto-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class items extends Component {
  render() {
    return (
      <Center>
        <Query query={ALL_ITEMS_QUERY}>
          {({ loading, data, error }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            // console.log(data.items.length);
            return (
              <ItemList>
                {data.items.map(item => (
                  <Item key={item.id} item={item} />
                ))}
              </ItemList>
            );
          }}
        </Query>
      </Center>
    );
  }
}

export default items;
