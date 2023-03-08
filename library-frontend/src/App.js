import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()

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
          </ul>
        </nav>

        <Routes>
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add" element={<NewBook />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
