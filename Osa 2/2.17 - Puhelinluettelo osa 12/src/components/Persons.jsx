const Persons = ({namesToShow, deleteName}) => {
    return (
    <div>
        {namesToShow.map(person => (
            <div key={person.id}>
                {person.name} {person.number}
                <button onClick={deleteName} value={person.name}>Delete</button>
            </div>
            ))}
    </div>
)}

export default Persons