import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    {name: 'Arto Hellas'}
  ])
  const [newName, setNewName] = useState('')

  const addName = (event) => {
    event.preventDefault()
    handleCheck()
    handleNameChange()
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleCheck = () => {
    const names = persons.map(person => person.name)
    names.some((name) => name == newName) ? 
    alert(`${newName} is already added to phonebook`) : 
    setPersons(persons.concat({name:newName}))
  }

return (
  <div>
    <h2>Phonebook</h2>
    <form onSubmit={addName}>
      <div>
        Name: <input id="name" onChange={handleNameChange}/>
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
    <h2>Numbers</h2>
    {persons.map(person => <div key={person.name}>{person.name}</div>)}
  </div>
  )
}

export default App