import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

import { ALL_ITEMS_QUERY } from "./items";

import Form from "./styles/Form";
import formatMonney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      image
    }
  }
`;

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  state = {};

  deleteHandler = (event, deleteItem) => {
    event.preventDefault();

    if (confirm("Are you sure, you want to delete this item ?")) {
      debugger;
      deleteItem();
    }
  };

  updateCache = (cache, payload) => {
    debugger;
    // manually update the cache to match with server response

    // 1. Read the cache for the items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    console.log(data);

    // 2. Filter the data without the deleted item
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );

    // 3. Put the item back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.updateCache}
      >
        {(deleteItem, { error }) => (
          <button onClick={event => this.deleteHandler(event, deleteItem)}>
            {this.props.children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
