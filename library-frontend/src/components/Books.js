import { ALL_BOOKS, BOOK_ADDED } from '../queries'
import { useQuery, useSubscription } from '@apollo/client'
import { useState } from 'react';

const Books = () => {
  const [selectedGenres, setSelectedGenres] = useState([])
  const { loading, error, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenres.length > 0 ? selectedGenres[0] : null },
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      refetch()
    }
  })

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
            onChange={async e =>  {
              if (e.target.checked) {
                await setSelectedGenres([...selectedGenres, genre])
              } else {
                await setSelectedGenres(selectedGenres.filter(g => g !== genre))
              }
            refetch()
            }}
          
            />
          </label>
        )))}
      </div>
      <button onClick={async () => { 
        await setSelectedGenres([])
        refetch()
      }}>clear filters</button>

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
