import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    {name: 'Arto Hellas', number: '040-1231244'}
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addName = (event) => {
    event.preventDefault()
    handleCheck()
    handleNameChange()
    handleNumberChange()
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleCheck = () => {
    const names = persons.map(person => person.name)
    names.some((name) => name == newName) ? 
    alert(`${newName} is already added to phonebook`) : 
    setPersons(persons.concat({name:newName, number:newNumber}))
  }

return (
  <div>
    <h2>Phonebook</h2>
    <form onSubmit={addName}>
      <div>
        Name: <input id="name" onChange={handleNameChange}/>
      </div>
      <div>
        Number: <input id="number" onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
    <h2>Numbers</h2>
    {persons.map(person => <div key={person.name}>{person.name} {person.number}</div>)}
  </div>
  )
}

export default App