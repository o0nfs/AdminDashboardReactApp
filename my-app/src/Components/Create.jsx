import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import birth_date_icon from "./Assets/birth.png";
import { Link, useNavigate } from 'react-router-dom'
import React, { useState} from 'react'
function Create() {
  const [date, setDate] = useState(new Date());
  const [values, setValues]=useState({
    name:" ",
    Email:" ",
    phone:" ",
    status:" ",
    birthDate:" "
  })
  const navigate = useNavigate()
  const handleSubmit=(event)=>{
    event.preventDefault();
    axios.post('http://localhost:3000/users', { ...values, birthDate: date })
    .then(res => {console.log(res)
    navigate('/home')})
    .catch(err => err);
  }
  return (
    <div className='d-flex w-100 vh-100 justify-content-center align-items-center bg-light'>
      <div className='w-50 border bg-white shadow px-5 pt-3 pb-5 rounded'>
        <h1>Add a User</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-2'>
            <label htmlFor="name">Name:</label>
            <input type="text" name='name' className='form-control' placeholder='Enter Name' onChange={e=> setValues({...values,name: e.target.value})}/>
          </div>
          <div className='mb-2'>
            <label htmlFor="Email">Email:</label>
            <input type="Email" name='Email' className='form-control' placeholder='Enter Email' onChange={e=> setValues({...values,Email: e.target.value})} />
          </div>
          <div className='mb-2'>
            <label htmlFor="phone">Phone:</label>
            <input type="number" name='phone' className='form-control' placeholder='Enter Phone' onChange={e=> setValues({...values,phone: e.target.value})} />
          </div>
          <div className='mb-2'>
            <label htmlFor="status">status:</label>
            <input type="text" name='status' className='form-control' placeholder='Enter status' onChange={e=> setValues({...values,status: e.target.value})} />
          </div>
          <div className="mb-2">
              <img src={birth_date_icon} alt="birthDate" />
              <DatePicker
                selected={date}
                name="birthDate"
                placeholder="Birth Date"
                onChange={(date) => setDate(date)}
              />
            </div>
          <button className='btn btn-success'>Submit</button>
          <Link to="/home" className="btn btn-primary ms-3">Back</Link>
        </form>
      </div>
     
    </div>
  )
}

export default Create
