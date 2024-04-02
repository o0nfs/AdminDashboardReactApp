import React, { useState } from "react";
import "./LoginSignup.css";
import { useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Link, useNavigate } from "react-router-dom";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import user_icon from "../Assets/user.png";
import birth_date_icon from "../Assets/birth.png";

function LoginSignup({onLogin}) {

  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [values, setValues] = useState({
    name: " ",
    Email: " ",
    birthDate: " ",
    password: " ",
  });
  
  const [loginValue, setLoginValue] = useState({
    Email: " ",
    password: " ",
  });
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const loadData = () => {
    axios
      .get("http://localhost:5000/admins")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => err);
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleLogin = () => {
    const findData = data.find((f) => f.Email === loginValue.Email);
    console.log({ findData });
    if (findData) {
      if (findData.password === loginValue.password) {
        onLogin(loginValue)
        navigate("/home");
      }
    }
  };

  const handleSubmit = (event) => {
    console.log("submit");
    event.preventDefault();
    console.log({ ...values, birthDate: date });
    axios
      .post("http://localhost:5000/admins", { ...values, birthDate: date })
      .then((res) => {
        console.log(res);
        setAction("Login");
        loadData();
      })
      .catch((err) => err);
  };

  //   const Test = () => {
  //     fetch(
  //       "https://www.randomnumberapi.com/api/v1.0/random?min=1&max=3&count=1",
  //       {}
  //     )
  //       .then((res) => res.json())
  //       .then((json) => {
  //         setNumber(json);
  //       });
  //   };

  //   function handleClick() {
  //     Test();
  //     if (number == 1) {
  //       navigate("/Admin");
  //     }
  //   }

  const [action, setAction] = useState("Sign Up");
  const [step, setStep] = useState("step1");
  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
        <div className="submit-container">
          <div
            className={action === "Login" ? "submit gray" : "submit"}
            onClick={() => {
              setAction("Sign Up");
            }}
          >
            Sign Up
          </div>
          <div
            className={action === "Sign Up" ? "submit gray" : "submit"}
            onClick={() => {
              setAction("Login");
            }}
          >
            Login
          </div>
        </div>
      </div>
      <div>
        {action === "Sign Up" && step === "step1" ? (
          <div className="inputs">
            <div className="input">
              <img src={user_icon} alt="user" />
              <input
                maxLength={20}
                type="text"
                placeholder="Name"
                name="name"
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
            </div>

            <div className="input">
              <img src={email_icon} alt="email" />
              <input
                maxLength={20}
                type="email"
                placeholder="Email"
                name="Email"
                onChange={(e) =>
                  setValues({ ...values, Email: e.target.value })
                }
              />
            </div>

            <div className="input">
              <img src={birth_date_icon} alt="birthDate" />
              <DatePicker
                selected={date}
                name="birthDate"
                placeholder="Birth Date"
                onChange={(date) => setDate(date)}
              />
            </div>
            <div
              className="submit-container"
              onClick={() => {
                setStep("step2");
              }}
            >
              <div className="submit">Next</div>
            </div>
          </div>
        ) : action === "Sign Up" && step === "step2" ? (
          <div className="inputs">
            <div className="input">
              <img src={password_icon} alt="password" />
              <input
                maxLength={20}
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
            </div>
            <div className="input">
              <img src={password_icon} alt="password" />
              <input
                maxLength={20}
                type="password"
                placeholder="Reapeat Password"
              />
            </div>
            <div className="submit-container">
              <div
                className="submit"
                onClick={() => {
                  setStep("step1");
                }}
              >
                Back
              </div>
              <div className="submit" onClick={handleSubmit}>
                Submit
              </div>
            </div>
          </div>
        ) : (
          <form className="inputs" onSubmit={handleLogin}>
            <div className="input">
              <img src={email_icon} alt="email" />
              <input
                maxLength={20}
                type="email"
                placeholder="Email"
                name="Email"
                onChange={(e) =>
                  setLoginValue({ ...loginValue, Email: e.target.value })
                }
              />
            </div>
            <div className="input">
              <img src={password_icon} alt="password" />
              <input
                maxLength={20}
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) =>
                  setLoginValue({ ...loginValue, password: e.target.value })
                }
              />
            </div>
            <div className="submit-container">
              <div className="submit" onClick={handleLogin}>
                Submit
              </div>
            </div>
          </form>
        )}
      </div>

      {action === "Sign Up" ? (
        <div></div>
      ) : (
        <div className="forgot-password">
          Lost Password?<span>Click here</span>
        </div>
      )}
    </div>
  );
}
export default LoginSignup;
