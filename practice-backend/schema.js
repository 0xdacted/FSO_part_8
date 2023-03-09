import gql from "graphql-tag"

const typeDefs = gql`
type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
  editNumber(
    name: String!
    phone: String!
  ): Person
  createUser(
    username: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
  addAsFriend(
    name: String!
  ): User
}
  type Address {
    city: String!
    street: String!
  }
  type Person {
    name: String!
    phone: String
    address: Address!
    friendOf: [User!]!
    id: ID!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone:YesNo): [Person!]!
    findPerson(name: String!): Person
    me: USer
  }

  type Subscription {
    personAdded: Person!
  }
`
module.exports = typeDefs