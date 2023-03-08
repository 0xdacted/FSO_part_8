import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

const App = () => {
  const [token, setToken] = useState(null)

  return (
    <Router>
      <div>
        {!token && <LoginForm setToken={setToken}></LoginForm>}
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
              <Link to="/add">Add Book</Link>
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
