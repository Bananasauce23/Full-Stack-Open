import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then((response) => {
      setPersons(response.data)
    })
  }, [])

  const namesToShow = showAll
  ? persons
  : persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  const addName = (event) => {
    event.preventDefault()
    handleCheck()
    handleNameChange(event)
    handleNumberChange(event)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleCheck = () => {
    const names = persons.map(person => person.name)
    names.some((name) => name == newName) 
    ? alert(`${newName} is already added to phonebook`) 
    : setPersons(persons.concat({name:newName, number:newNumber}))
  }

  const handleSearchCheck = (event) => {
    if (event.target.value.length >= 1) {
      setShowAll(false)
      setSearch(event.target.value)
    }
    else {
      setShowAll(true)
    }
  }

return (
  <div>
    <h2>Phonebook</h2>
    <Filter handleSearchCheck={handleSearchCheck}/>

    <h2>Add new</h2>
    <PersonForm 
    addName={addName}
    handleNameChange={handleNameChange}
    handleNumberChange={handleNumberChange}/>

    <h2>Numbers</h2>
    <Persons namesToShow={namesToShow}/>
  </div>
  )
}

export default App