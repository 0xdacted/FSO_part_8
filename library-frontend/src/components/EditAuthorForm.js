import { useState } from "react"
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const EditAuthorForm = () => {
  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState('')

  const [ changeBirthYear ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS }]
  })


  const handleSubmit = (event) => {
    event.preventDefault()

    const birthYearInt = parseInt(birthYear, 10)
    changeBirthYear({ variables: { name, setBornTo: birthYearInt }})
    setName('')
    setBirthYear('')

  }
  return (
    <div>
      <h2>Set birth year</h2>
      <form onSubmit={handleSubmit}>
        <div>
        name <input value={name} onChange={({ target }) => setName(target.value)}/>
        </div>
        <div>
          birth year <input value={birthYear} onChange={({ target }) => setBirthYear(target.value)} />
        </div>
        <button type="submit">change birth year</button>
      </form>
    </div>
  )
}

export default EditAuthorForm