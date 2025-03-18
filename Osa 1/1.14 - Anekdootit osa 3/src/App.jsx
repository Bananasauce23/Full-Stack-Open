import { useState } from 'react'

let voteList = new Uint8Array(8)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time... The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(0)
  const [mostVotesTxt, setMostVotesText] = useState(anecdotes[0])
  const [mostVotesNumber, setMostVotesNumber] = useState(0)

  const handleSelected = () => {
    let selected = Math.floor((Math.random() * anecdotes.length))
    const copy = [...voteList]
    setVotes(copy[selected])
    setSelected(selected)
    let mostVotesIndex = copy.indexOf(Math.max(...copy))
    let mostVotesText = anecdotes[mostVotesIndex]
    setMostVotesText(mostVotesText)
    setMostVotesNumber(copy[mostVotesIndex])
  }

  const handleVote = () => {
    voteList[selected] += 1
    const copy = [...voteList]
    setVotes(copy[selected])
    let mostVotesIndex = copy.indexOf(Math.max(...copy))
    let mostVotesText = anecdotes[mostVotesIndex]
    setMostVotesText(mostVotesText)
    setMostVotesNumber(copy[mostVotesIndex])
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}<br></br>
      <p>Has {votes} votes</p>
      <button onClick={handleVote}>Vote</button>
      <button onClick={handleSelected}>Next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <p>{mostVotesTxt}</p>
      <p>Has {mostVotesNumber} votes</p>
    </div>
  )
}

export default App