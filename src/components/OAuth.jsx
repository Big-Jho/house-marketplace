import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/GoogleIcon.svg";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db, auth } from "../firebase.config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();

      // 1. Trigger the popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 2. Check for user in Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // 3. If user doesn't exist, create them
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      toast.success("Login Successful");

      // 4. Redirect to profile
      navigate("/profile");
    } catch (error) {
      console.error(error);
      // Handle "Popup closed by user" specifically if you want
      if (error.code !== "auth/popup-closed-by-user") {
        toast.error("Could not authorize with Google");
      }
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with </p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={googleIcon} alt="google" />
      </button>
    </div>
  );
}

export default OAuth;
