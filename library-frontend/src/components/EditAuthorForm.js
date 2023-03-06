import { useState } from "react"
import Select from 'react-select'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const EditAuthorForm = () => {
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [birthYear, setBirthYear] = useState('')

  const [ changeBirthYear ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS }]
  })


  const { data } = useQuery(ALL_AUTHORS)

  const handleSubmit = (event) => {
    event.preventDefault()

    const birthYearInt = parseInt(birthYear, 10)
    changeBirthYear({ variables: { name: selectedAuthor, setBornTo: birthYearInt }})
    setSelectedAuthor(null)
    setBirthYear('')

  }
  const handleAuthorChange = (selectedOption) => {
    setSelectedAuthor(selectedOption.value)
  }

  const authorOptions = data.allAuthors.map(a => {
    return {value: a.name, label: a.name}
  })

  
  return (
    <div>
      <h2>Set birth year</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="author-select">Select Author:</label>
          <Select 
          id="author-select"
          options={authorOptions}
          onChange={handleAuthorChange}
          value={selectedAuthor ? {value: selectedAuthor, label: selectedAuthor } : null}
          />
        </div>
        {selectedAuthor && 
          <div>
          birth year <input value={birthYear} onChange={({ target }) => setBirthYear(target.value)} />
          </div>
           }
        <button type="submit">change birth year</button>
      </form>
    </div>
  )
}

export default EditAuthorForm