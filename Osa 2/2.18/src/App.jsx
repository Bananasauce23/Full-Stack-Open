import { useState, useEffect} from 'react'

const handleSearch = () => {

}

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch("https://studies.cs.helsinki.fi/restcountries/api/all")
    .then(response => response.json())
    .then(data => setCountries(data))
  }, [])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const filtered = countries.filter(country => 
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return(
    <div>Find countries <input onChange={handleSearch} value={search}/>
      {filtered.length > 10 && search !== "" ? (
        <div>Too many matches, specify another filter</div>
      ) : filtered.length === 1 ? (
        <div>
          <h1>{filtered[0].name.common}</h1>
          <div>Capital: {filtered[0].capital}</div>
          <div>Area: {filtered[0].area}</div>
          <h2>Languages</h2>
          <ul>
            {filtered[0].languages &&
              Object.values(filtered[0].languages).map(lang => (
                <li key={lang}>{lang}</li>
              ))}
          </ul>
          <img src={filtered[0].flags.png} width="200"/>
          </div>
        ) : (
        <ul>
          {filtered.map(country => (
            <li key={country.cca3}>{country.name.common}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App