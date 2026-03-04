import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowRightIcon from "../../assets/svg/keyboardArrowRightIcon.svg?react";
import { toast } from "react-toastify";
import visibilityIcon from "../../assets/svg/visibilityIcon.svg";
import OAuth from "../OAuth";

// Firebase Auth imports
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.config";

function SignIn() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredentials.user;

      toast.success("Login Successfully");

      navigate("/profile");
    } catch (error) {
      console.log(error.message);
      toast.error("Incorrect Credentials");
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome back!</p>
        </header>

        <form className="mt-20" onSubmit={onSubmit}>
          <input
            type="email"
            id="email"
            className="emailInput"
            placeholder="Email"
            value={email}
            onChange={onChange}
            // autocomplete="given-email"
          />

          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="passwordInput"
              placeholder="Password"
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt="visibility_icon"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>

          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        <OAuth />

        <Link className="registerLink" to="/sign-up">
          Register Instead
        </Link>
      </div>
    </>
  );
}

export default SignIn;
