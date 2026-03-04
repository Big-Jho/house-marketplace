import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowRightIcon from "../../assets/svg/keyboardArrowRightIcon.svg?react";
import visibilityIcon from "../../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import OAuth from "../OAuth";

// Importing Firebase auth
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase.config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.config";

function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredentials.user;

      console.log(user);

      updateProfile(auth.currentUser, { displayName: name });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Registration Successful");

      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
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
            type="text"
            id="name"
            className="nameInput"
            placeholder="Name"
            value={name}
            onChange={onChange}
            autocomplete="given-name"
          />

          <input
            type="email"
            id="email"
            className="emailInput"
            placeholder="Email"
            value={email}
            onChange={onChange}
            autocomplete="given-email"
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

          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>
        <OAuth />
        <Link className="registerLink" to="/sign-in">
          Sign In Instead
        </Link>
      </div>
    </>
  );
}

export default SignUp;
