import { useState } from 'react'

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <div>
      <p>{text} {value}</p>
    </div>
  )
}

const Statistics = (props) => {
  if (props.all > 0){
    return (
      <div>
        <h1>Statistics</h1>
        <StatisticLine text="Good" value={props.good}/>
        <StatisticLine text="Neutral" value={props.neutral}/>
        <StatisticLine text="Bad" value={props.bad}/>
        <StatisticLine text="All" value={props.all}/>
        <StatisticLine text="Average" value={props.average}/>
        <StatisticLine text="Positive" value={props.positive + "%"}/>
      </div>
    )
  }
  else{
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
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
      <Button onClick={handleGood} text="Good"/>
      <Button onClick={handleNeutral} text="Neutral"/>
      <Button onClick={handleBad} text="Bad"/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average.toFixed(5)} positive={positive.toFixed(5)}/>
    </div>
  )
}

export default App