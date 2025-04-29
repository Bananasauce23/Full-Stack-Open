import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    {name: 'Arto Hellas'}
  ])
  const [newName, setNewName] = useState('')

  const addName = (event) => {
    event.preventDefault()
    setNewName(document.getElementById("name").value)
    setPersons(persons.concat({name:newName}))
  }

return (
  <div>
    <h2>Phonebook</h2>
    <form>
      <div>
        Name: <input id="name"/>
      </div>
      <div>
        <button type="submit" value={newName} onClick={addName}>Add</button>
      </div>
    </form>
    <h2>Numbers</h2>
    {persons.map(person => <div key={person.name}>{person.name}</div>)}
  </div>
  )
}

export default App