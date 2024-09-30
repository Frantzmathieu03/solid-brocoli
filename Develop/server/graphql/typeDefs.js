const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]!
  }

  type Book {
    bookId: ID!
    title: String
    author: String
    description: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    getSingleUser(id: ID, username: String): User
    savedBooks: [Book]
  }

  type Mutation {
    createUser(input: CreateUserInput!): Auth
    login(input: LoginInput!): Auth
    saveBook(book: BookInput!): User
    deleteBook(bookId: ID!): User
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    username: String
    email: String
    password: String!
  }

  input BookInput {
    bookId: ID!
    title: String
    author: String
    description: String
    image: String
    link: String
  }
`;

module.exports = typeDefs;
