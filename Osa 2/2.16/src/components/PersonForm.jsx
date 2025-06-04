const PersonForm = ({addName, handleNameChange, handleNumberChange}) => {
    return <form onSubmit={addName}>
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
}

export default PersonForm