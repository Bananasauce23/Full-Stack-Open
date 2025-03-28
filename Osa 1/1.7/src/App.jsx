import { useState } from 'react'

let sum = 0
let average = 0

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const handleGood = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    setAll(updatedGood + neutral + bad)
    if (updatedGood + neutral + bad > 1){
      sum += 1
      average = sum / all
    }
    else{
      average = 1
    }
  }

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setAll(good + updatedNeutral + bad)
    if (good + updatedNeutral + bad > 1){
      average = sum / all
    }
    else{
      average = 0
    }
  }

  const handleBad = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    setAll(good + neutral + updatedBad)
    if (good + neutral + updatedBad > 1){
      sum -= 1
      average = sum / all
    }
    else{
      average = -1
    }
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

      <h1>Statistics</h1>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>All: {all}</p>
      <p>Average: {average}</p>
      <p>Positive: {good / all * 100}%</p>
    </div>
  )
}

export default App