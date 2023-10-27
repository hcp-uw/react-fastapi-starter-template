import './App.css' // import css file
import { useEffect, useState } from 'react' // import react hooks

// import a default export from a file
import PeopleForm from './components/PeopleForm'
// import a named export from a file
import { PeopleList } from './components/PeopleList'
// import functions from services folder
import { create, getAll } from './services/people'



// App component
function App () {
  // useState hooks to store state.
  // usage: const [state, setState] = useState(initialState)
  // note that every time you call setState, the component will re-render
  const [age, setAge] = useState('')
  const [name, setName] = useState('')
  const [people, setPeople] = useState([])

  // useEffect hook to make API call when component mounts
  // usage: useEffect(callback, [dependencies])
  // if you pass an empty array as the second argument, the callback will only
  // be called once, when the component mounts
  useEffect(() => {
    getAll().then(response => {
      setPeople(response.people.map(person => ({ person, active: true })))
    })
  }, [])

  // event handlers helper functions. update state and make calls
  // to the backend through the services functions

  // note that react handles the state locally so that you don't need
  // to refresh the page to see the changes. this is what makes react
  // so powerful
  const handleSubmit = e => {
    e.preventDefault() // prevent default form submission page refresh
    setAge('') // clear the
    setName('') // input fields

    // call the create function from services/people.js and update local state
    create(name, age).then(response => setPeople([...people, response.person]))
  }

  // return the JSX that will be rendered. this is another powerful feature
  // of react. JSX is a syntax extension to javascript that allows us to
  // write HTML-like code inside javascript.
  //
  // note: the return statement can only return one element, so we wrap
  // everything in a div
  //
  // note: you can use javascript expressions inside JSX by wrapping them
  // in curly braces. this is how we can use the state variables in our JSX
  //
  // note: the className attribute is used instead of class
  // this is because class is a reserved keyword in javascript
  //
  // note: we pass the event handlers as props to the PeopleList and PeopleForm
  // components so that they can be used there. the ability to define your own
  // components and pass arbitrary props to them is another powerful feature
  // of react

  return (
    <div className='App'>
      <h1 className='App-header'>Add People</h1>
      <PeopleForm
        handleSubmit={handleSubmit}
        name={name}
        age={age}
        setName={setName}
        setAge={setAge}
      />
      <PeopleList people={people} age={age} name={name} setPeople={setPeople} />
    </div>
  )
}

export default App
