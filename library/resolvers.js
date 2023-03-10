const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/Book')
const Author = require('./models/Author')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const DataLoader = require('dataloader')

const batchLoadBookCounts = async (authorIds) => {
  const books = await Book.aggregate([
    { $match: { author: { $in: authorIds } } },
    { $group: { _id: '$author', bookCount: { $sum: 1 } } }
  ])

  const bookCountsByAuthorId = books.reduce((result, book) => {
    result[book._id.toString()] = book.bookCount
    return result
  }, {})
  return authorIds.map((authorId) => bookCountsByAuthorId[authorId.toString() || 0])
}

const bookCountLoader = new DataLoader(batchLoadBookCounts)

const resolvers = {
  Query: {
    bookCount: async () =>  Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const genre = args.genre;
      let query = {};
      if (genre) {
        query = { genres: { $in: [genre] } };
      }
      const books = await Book.find(query).populate('author');
      return books.map((book) => ({
        title: book.title,
        published: book.published,
        author: {
          name: book.author.name,
          born: book.author.born
        },
        genres: book.genres,
        id: book._id
      }
      ));
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const bookCounts = await bookCountLoader.loadMany(authors.map((author) => author._id))
      return authors.map((author, index) => {
        return {
          ...author._doc,
          bookCount: bookCounts[index] || 0
          
        }
      })
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not Authenticated')
      }
      try {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author }) 
        author = await author.save()
      }
      const book = new Book({...args, author: author._id})
      await book.populate('author')
      await book.save()
      
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    } catch (error) {
      throw new GraphQLError(error.message)
    }
    
   
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not Authenticated')
      }
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      return author.save()
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
        password: 'password123'
      })
      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          invalidArgs: args
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'password123') {
        throw new GraphQLError('Invalid Credentials')
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }
      return { value: jwt.sign(userForToken, JWT_SECRET)}
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}
  
module.exports = resolvers