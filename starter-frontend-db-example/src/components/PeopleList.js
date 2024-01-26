import './PeopleList.css'
import { updatePerson, deletePerson } from '../services/people'

// this is an example of a functional component
// using the arrow function syntax
const PeopleList = props => {
  // destructure props
  const { people, setPeople, age, name } = props
  // more event handlers
  const handleDelete = id =>
    deletePerson(id).then(() =>
      setPeople(people.filter(person => person.id !== id))
    )

  const handleUpdate = id =>
    updatePerson(id, name, age).then(response =>
      setPeople(
        people.map(person => (person.id === id ? response.person : person))
      )
    )

  // note: the map function is used to iterate over the people array
  // and return a list of JSX elements. this is a common pattern in react
  // and is called a "list comprehension"
  return (
    <ul className='People-list'>
      { people.map(
        (
          person // list comprehension
        ) => (
          <li key={person.id} className='Person-item'>
            <span className='Person-info'>
              {person.name} is {person.age} years old
            </span>
            <button
              className='Button-delete'
              onClick={() => handleDelete(person.id)}
            >
              Delete
            </button>
            <button
              className='Button-update'
              onClick={() => handleUpdate(person.id)}
            >
              Update
            </button>
          </li>
        )
      )}
    </ul>
  )
}

export { PeopleList }
