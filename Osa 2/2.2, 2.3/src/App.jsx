const Header = ({course}) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Part = ({name, exercises}) => {
  return (
    <p>{name} {exercises}</p>
  )
}

const Content = (props) => {
  const {parts} = props
  return (
    <div>
      {parts.map(part => 
      <div key={part.id}>
        <Part name={part.name} exercises={part.exercises}/>
      </div>)}
    </div>
    )
}

const Total = ({parts}) => {
  const total = parts.reduce((s,p) => s.exercises + p.exercises)
  return (
    <b>Total of {total} exercises</b>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header course={course}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course}/>
    </div>
  )
}

export default App