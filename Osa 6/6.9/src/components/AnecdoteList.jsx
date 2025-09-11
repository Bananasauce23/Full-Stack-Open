import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const filteredAnecdotes = anecdotes.filter(a =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )
  const dispatch = useDispatch()

  const handleVote = (id) => {
    dispatch(voteAnecdote(id))
  }

  const sortedFilteredAnecdotes = filteredAnecdotes.slice().sort((a, b) => b.votes - a.votes)

  return (
    <>
      {sortedFilteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          {anecdote.content} has {anecdote.votes}
          <button onClick={() => handleVote(anecdote.id)}>vote</button>
        </div>
      )}
    </>
  )
}

export default AnecdoteList