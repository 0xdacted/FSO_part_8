import { ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'
import { useState } from 'react';

const Books = () => {
  const [selectedGenres, setSelectedGenres] = useState([])
   const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenres.length > 0 ? selectedGenres[0] : null },
  });


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {`${error}`}</p>

  const books = data.allBooks
  const genres = books.map(b => b.genres)
  const uniqueGenres = Array.from(new Set(genres.flat()))

  return (
    <div>
      <h2>books</h2>

      <div>
        {(uniqueGenres.map(genre => (
          <label key={genre}>
            {genre}
            <input type="checkbox" checked={selectedGenres.includes(genre)}
            onChange={e => {
              if (e.target.checked) {
                setSelectedGenres([...selectedGenres, genre])
              } else {
                setSelectedGenres(selectedGenres.filter(g => g !== genre))
              }

            }}
          
            />
          </label>
        )))}
      </div>
      <button onClick={() => setSelectedGenres([])}>clear filters</button>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
