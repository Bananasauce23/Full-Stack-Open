import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const Notification = ({message, type}) => {
  if (message === null) {
      return null
    }
  return (
    <div className="message" id={type}>
      {message}
    </div>
  ) 
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
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
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name == newName)) {
      if (persons.some(person => person.number == newNumber)) {
        alert(`${newName} is already added to phonebook`)
      }
      else if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const existingPerson = persons.find(person => person.name === newName)
        personService
          .change(existingPerson.id, {...existingPerson, number: newNumber})
          .then(response => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : response.data))
          })
          .catch(error => {
            setMessage(
              `Information of ${newName} has already been removed from server.`
            )
            setMessageType(
              'error'
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    }
    else{
    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
      })
      .then(success => {
        setMessage(
          `Added '${newName}'`
        )
        setMessageType(
          'success'
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
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

  const deleteName = (event) => {
    const name = event.target.value
    const person = persons.find(p => p.name === name)
    if (person && window.confirm(`Delete ${name}?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

return (
  <div>
    <h2>Phonebook</h2>
    <Notification message={message} type={messageType}/>
    <Filter handleSearchCheck={handleSearchCheck}/>

    <h2>Add new</h2>
    <PersonForm 
    addName={addName}
    handleNameChange={handleNameChange}
    handleNumberChange={handleNumberChange}/>

    <h2>Numbers</h2>
    <Persons namesToShow={namesToShow}
    deleteName={deleteName}/>
  </div>
  )
}

export default App