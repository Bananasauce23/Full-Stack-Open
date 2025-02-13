const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = ({name, exercise}) => {
  return (
    <div>
      <p>{name} {exercise}</p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part parts={props.parts}/>
    </div>
    )
}

const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.parts}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course}/>
      <Content parts={parts}/>
      <Total parts={parts}/>
    </div>
  )
}

export default App