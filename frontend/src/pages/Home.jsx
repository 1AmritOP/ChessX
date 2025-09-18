import React from 'react'
import {Link} from "react-router-dom"
const Home = () => {
  return (
    <>
    <h1>ChessX</h1>
    <button className=' mt-2'>
        <Link className='px-4 py-2 bg-green-400 rounded-2xl ' to={"/game"} >Play</Link>
    </button>

    </>
  )
}

export default Home