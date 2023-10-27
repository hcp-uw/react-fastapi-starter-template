import './PeopleForm.css'

// directly export the function as the default export of this file.
// This is the function that will be imported in App.js, and since it is
// the default export, you can name it whatever you want when you import it.
export default function PeopleForm ({
  handleSubmit, //  <-- destructured props
  name,         // you can also 
  age,          // destructure 
  setName,      // props in the 
  setAge        // function signature
}) {
  return (
    <form className='Form' onSubmit={handleSubmit}>
      <input
        className='Form-input'
        type='text'
        placeholder='Enter name'
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className='Form-input'
        type='number'
        placeholder='Enter age'
        value={age}
        onChange={e => setAge(e.target.value)}
      />
      <button className='Form-button' type='submit'>
        Add Person
      </button>
    </form>
  )
}
