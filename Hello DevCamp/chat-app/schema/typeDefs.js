const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    isOnline: Boolean!
  }

  type Token {
    token: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    register(username: String!, password: String!): User!
    login(username: String!, password: String!): Token!
    updateStatus(userId: ID!, isOnline: Boolean!): User!
  }
`;

module.exports = typeDefs;
