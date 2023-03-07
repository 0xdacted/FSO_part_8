const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const Book = require('./models/Book')
const Author = require('./models/Author')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const typeDefs = `
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }
  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      let filteredBooks = books
      if (args.author) {
        filteredBooks = filteredBooks.filter(book => book.author === args.author)
      } 
      if (args.genre) {
        filteredBooks.filter(book => book.genre === args.genre)
      }
      return filteredBooks
    },
    allAuthors: () => {
      return authors.map(author => {
        const bookCount = books.filter(book => book.author === author.name).length
        return {...author, bookCount}
      })
    }
  },
  Mutation: {
    addBook: (root, args) => {
      if (books.find(b => b.title === args.title)) {
        throw new GraphQLError('Name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      const book = { ...args, id: uuid() }
      books = books.concat(book)
      if (!authors.find(a => a.name === args.author)) {
        const author = { name: args.author, bookCount: 1}
        authors = authors.concat(author)
      }
      return book
    },
    editAuthor: (root, args) => {
      console.log(args)
      const author = authors.find(a => a.name === args.name)
      console.log(author)
      if (!author) {
        return null
      }
      const updatedAuthor = {...args, born: args.setBornTo}
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)

      return updatedAuthor
    }
  }
}
  

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})