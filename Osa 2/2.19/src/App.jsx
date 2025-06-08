import { useState, useEffect} from 'react'

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [shown, setShown] = useState(null)

  useEffect(() => {
    fetch("https://studies.cs.helsinki.fi/restcountries/api/all")
    .then(response => response.json())
    .then(data => setCountries(data))
  }, [])

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setShown(null)
  }

  const filtered = countries.filter(country => 
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return(
    <div>Find countries <input onChange={handleSearch} value={search}/>
      {filtered.length > 10 && search !== "" ? (
        <div>Too many matches, specify another filter</div>
      ) : filtered.length === 1 || shown ? (
        <div>
          <h1>{(shown ? shown.name.common : filtered[0].name.common)}</h1>
          <div>Capital: {(shown ? shown.capital : filtered[0].capital)}</div>
          <div>Area: {(shown ? shown.area : filtered[0].area)}</div>
          <h2>Languages</h2>
          <ul>
            {(shown ? shown.languages : filtered[0].languages) &&
              Object.values(shown ? shown.languages : filtered[0].languages).map(language => (
                <li key={language}>{language}</li>
              ))}
          </ul>
          <img src={(shown ? shown.flags.png : filtered[0].flags.png)} width="200"/>
          </div>
        ) : (
        <ul>
          {filtered.map(country => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => setShown(country)}>Show</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App