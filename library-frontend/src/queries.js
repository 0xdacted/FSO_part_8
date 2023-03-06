import { gql, useQuery } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name,
      born,
      bookCount,
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title,
      author,
      published,
    }
  }
`

export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $born: Int!) {
  editAuthor(name: $name, born: $born) {
    name
    born
    bookCount
  }
}
`

