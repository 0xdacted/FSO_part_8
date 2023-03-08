import { GET_USER, ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'

const RecommendedPage = () => {
  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER)
  const { loading: booksLoading, error: booksError, data: booksData } = useQuery(ALL_BOOKS)

  if (booksLoading || userLoading) return <p>Loading...</p>;
  if (booksError || userError ) return <p>Error: {`${booksError || userError}`}</p>;

  const books = booksData.allBooks;
  const user = userData.me
  const favoriteGenre = user.favoriteGenre
  const recommendedBooks = books.filter(b => b.genres.includes(favoriteGenre))

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th></th>
            {recommendedBooks.length > 0 && <div>
            <th>author</th>
            <th>published</th> 
            </div>}
          </tr>
          {recommendedBooks.map((a) => (
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

export default RecommendedPage