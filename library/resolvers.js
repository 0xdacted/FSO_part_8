const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/Book')
const Author = require('./models/Author')

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
      const books = await Book.find({}).populate('author')
      return authors.map(author => {
        const bookCount = books.filter(book => String(book.author._id) === String(author._id)).length
        return { ...author._doc, bookCount }
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
  }
}
  
module.exports = resolvers