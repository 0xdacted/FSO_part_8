import { useState, useEffect } from 'react'
import { useQuery, useMutation, useApolloClient, useSubscription } from '@apollo/client'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import RecommendedPage from './components/RecommendedPage'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

export const updateCache = async (cache, query, addedBook, refetch) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      if (item) {
        let k = item.title
        return seen.has(k) ? false : seen.add(k)
      }
    })
  }
  
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook))
    }
  })

  await refetch()
}

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const { loading, error, data: allBooks, refetch } = useQuery(ALL_BOOKS)

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`Book "${addedBook.title}" by ${addedBook.author.name} has been added!`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook, refetch)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useEffect(() => {
    const userToken = localStorage.getItem('library-user-token')
    userToken ? setToken(userToken) : setToken(null)
  }, [token])

  return (
    <Router>
      <div>
        {!token ? <LoginForm setToken={setToken}></LoginForm> : <div> <Link to="/add">Add Book</Link> <button onClick={logout}>logout</button> </div>}
      </div>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/authors">Authors</Link>
            </li>
            <li>
              <Link to="/books">Books</Link>
            </li>
            <li>
              <Link to='/recommended'>Recommended</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path='/recommended' element={<RecommendedPage />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add" element={<NewBook />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
