import './App.css' // import css file
import { useEffect, useState } from 'react';
import axios from 'axios';

function realApiCall(name) {
  return axios.get(`http://localhost:8000/greeting/${name}`)
}

function fakeApiCall() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        name: "John Doe",
        age: 32,
        address: "123 Main St",
        friends: [
          { name: "Jane Doe", age: 31, address: "123 Main St" },
          { name: "John Smith", age: 33, address: "123 Main St" },
          { name: "Jane Smith", age: 34, address: "123 Main St" },
        ]})
    }
    , 1000)
  })
}

function greetingButton(name) {
  const handleClick = () => {
    realApiCall(name).then((response) => {
      alert(`You have one greeting: ${response.data.message}`)
    })
  }

  return (
    <button style={{ margin: "10px" }}
     onClick={handleClick}>Greet {name}</button>
  )
}



const Person = ({ name, age, address }) => {
  return (
    <div style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
      <h4>{name}</h4>
      <h5>{age}</h5>
      <h6>{address}</h6>
    </div>
  )
}

function App () {

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [address, setAddress] = useState("")
  const [friends, setFriends] = useState([])

  useEffect(() => {
    fakeApiCall().then((data) => {
      setName(data.name)
      setAge(data.age)
      setAddress(data.address)
      setFriends(data.friends)
    })
  }
  , [])


  return (
    <div className="app">
      <header className="app-header">
        <h1>My Friends</h1>
        <Person name={name} age={age} address={address} />
        {greetingButton(name)}
        <h2>Friends</h2>
        {friends.map((friend, i) => {
          return <Person key={i} name={friend.name} age={friend.age} address={friend.address} />
        })}
      </header>
    </div>
  )
}

export default App
