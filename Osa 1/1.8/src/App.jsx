import { useState } from 'react'

const Statistics = (props) => {
  return (
    <div>
      <h1>Statistics</h1>
      <p>Good: {props.good}</p>
      <p>Neutral: {props.neutral}</p>
      <p>Bad: {props.bad}</p>
      <p>All: {props.all}</p>
      <p>Average: {props.average}</p>
      <p>Positive: {props.positive}%</p>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const average = all > 0 ? (good - bad) / all : 0
  const positive = all > 0 ? good / all * 100 : 0

  const handleGood = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    setAll(updatedGood + neutral + bad)
  }

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setAll(good + updatedNeutral + bad)
  }

  const handleBad = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    setAll(good + neutral + updatedBad)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <button onClick={handleGood}>
        Good
      </button>

      <button onClick={handleNeutral}>
        Neutral
      </button>

      <button onClick={handleBad}>
        Bad
      </button>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average.toFixed(5)} positive={positive.toFixed(5)}/>
    </div>
  )
}

export default App