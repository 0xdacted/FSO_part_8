import { useState } from "react"
import { useMutation } from '@apollo/client'

const editAuthorForm = () => {
  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState(null)


  const handleSubmit = () => {
    event.preventDefault()

  }
  return (
    <div>
    <h2>Set birth year</h2>
    <form onSubmit={handleSubmit()}>
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