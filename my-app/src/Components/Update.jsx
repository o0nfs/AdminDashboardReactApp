import { useParams } from "react-router";
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import FileBase64 from "react-file-base64";
import { imageDefault } from "./DefaultValue";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import birth_date_icon from "./Assets/birth.png";

import Chart from 'react-apexcharts'

function Update() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();
  //const [data, setData]=useState([])

  const { id } = useParams();
  const [values, setValues] = useState({
    name: "",
    Email: "",
    phone: "",
    image: "",
    birthDate:" "
  });
  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // const onImageChange = (event) => {
  //  if (event.target.files && event.target.files[0]) {
  //    setValues({...values,image: URL.createObjectURL(event.target.files[0])})
  //  }
  // }

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/" + id)
      .then((res) => setValues(res.data))
      .catch((err) => err);
  }, []);

  const handleUpdate = (event) => {
    event.preventDefault();
    axios
      .put("http://localhost:3000/users/" + id,{ ...values, birthDate: date })
      .then((res) => {
        console.log(res);
        navigate("/home");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
      <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
        <h1>Update User</h1>
        <div className=" d-flex justify-content-center p-2">
          <img
            src={values.image ? values.image : imageDefault}
            onClick={handleOpen}
            alt="profile"
            style={{ width: "10%", height: "10%" }}
          />
        </div>
        <div>
          <div className="mb-2">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Name"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email">Email:</label>
            <input
              type="Email"
              name="Email"
              className="form-control"
              placeholder="Enter Email"
              value={values.Email}
              onChange={(e) => setValues({ ...values, Email: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="phone">Phone:</label>
            <input
              type="number"
              name="phone"
              className="form-control"
              placeholder="Enter Phone"
              value={values.phone}
              onChange={(e) => setValues({ ...values, phone: e.target.value })}
            />
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
          <div className="mb-2">
            <label htmlFor="profile">profile:</label>
            <FileBase64
              onDone={({ base64 }) => setValues({ ...values, image: base64 })}
            />
            <button
              onClick={() => setValues({ ...values, image: null })}
              className="btn btn-danger ms-5"
            >
              Delete image
            </button>
          </div>
          <button onClick={handleUpdate} className="btn btn-success">
            Update
          </button>
          <Link to="/home" className="btn btn-primary ms-3">
            Back
          </Link>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-center align-items-center" style={{}}>
            <img src={values.image ? values.image : imageDefault} style={{width:"400px", height:"400px"}}/>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Update;
