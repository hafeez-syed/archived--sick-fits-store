import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMonney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
      title
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: "Cool Shoes",
    description: "Italian shoe",
    price: 1000,
    image: "",
    largeImage: ""
  };

  handleSubmit = event => {
    const { name, value, type } = event.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadImage = async event => {
    console.log("uploading files ...");
    const files = event.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sickfits");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/hafeezsyed/image/upload",
      {
        method: "POST",
        body: data
      }
    );

    const file = await res.json();

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
    console.log(file);
  };
  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async event => {
              // Stop the form from submitting
              event.preventDefault();
              const response = await createItem();
              // Bring them to the single item page
              console.log(response);
              Router.push({
                pathname: "/item",
                query: {
                  id: response.data.createItem.id
                }
              });
            }}
          >
            <Error error={error} />
            <h2>Sell an item</h2>
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                File
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an Image"
                  onChange={this.uploadImage}
                  required
                />
                {this.state.image && (
                  <img
                    src={this.state.image}
                    alt="upload preview"
                    width="250"
                  />
                )}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  onChange={this.handleSubmit}
                  value={this.state.title}
                  required
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  onChange={this.handleSubmit}
                  value={this.state.price}
                  required
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  placeholder="The description for this item"
                  onChange={this.handleSubmit}
                  value={this.state.description}
                  required
                />
              </label>
              <button>Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
