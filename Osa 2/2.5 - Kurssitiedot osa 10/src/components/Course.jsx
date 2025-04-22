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

export default Course