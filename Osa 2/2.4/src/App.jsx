const Header = ({name}) => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  )
}

const Part = ({name, exercises}) => {
  return (
    <p>{name} {exercises}</p>
  )
}

const Content = ({content}) => {
  return (
    <div>
    {content.parts.map(part =>
      <Part key={part.id} name={part.name} exercises={part.exercises}/>
    )}
    </div>
    )
}

const Total = ({content}) => {
  const total = content.reduce((s,p) => s + p.exercises, 0)
  return (
    <b>Total of {total} exercises</b>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name}/>
      <Content content={course}/>
      <Total content={course.parts}/>
    </div>
  )
}

const Curriculum = ({courses}) => {
  return (
    <div>
      {courses.map(course => 
      <div key={course.id}>
        <Course course={course}/>
      </div>)}
    </div>
  )
}

const App = () => {
  const courses = [
    {
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <Curriculum courses={courses}/>
    </div>
  )
}

export default App