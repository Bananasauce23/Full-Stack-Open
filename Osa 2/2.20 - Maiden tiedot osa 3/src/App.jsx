import { useState, useEffect} from 'react'

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [shown, setShown] = useState(null)
  const [weather, setWeather] = useState(null)

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

  useEffect(() => {
    const country = shown || filtered[0]
    if (!country || !country.capital) {
      setWeather(null)
      return
    }
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    const capital = Array.isArray(country.capital) ? country.capital[0] : country.capital
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`)
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(() => setWeather(null))
  }, [shown, filtered])

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
          <h2>Weather in {shown ? shown.capital : filtered[0].capital}</h2>
            {weather && weather.main ? (
              <div>
                <div>Temperature: {weather.main.temp}</div>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
                <div>Wind: {weather.wind.speed} m/s</div>
              </div>
            ) : (
              <div>Loading weather...</div>
            )}
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