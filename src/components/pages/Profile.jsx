import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.config";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Profile() {
  const navigate = useNavigate();

  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const logOut = () => {
    auth.signOut();
    toast.success("Logout Successfully");
    navigate("/");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (auth.currentUser.displayName !== name) {
        // update displayName in fb
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // update in fireStore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
      });

      toast.success("Profile Updated");
    } catch (error) {
      console.log(error.message);
    }

    console.log(123);
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>

        <button className="logOut" onClick={logOut}>
          Log Out
        </button>
      </header>

      <main className="mt-10">
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={(e) => {
              changeDetails && onSubmit(e);
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "Done" : "Change"}
          </p>
        </div>

        <div className="profileCard mt-4">
          <form className="space-y-4">
            <input
              type="text"
              id="name"
              className={`${changeDetails ? "profileNameActive" : "profileName"} focus:outline-none`}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <br />
            <input
              type="email"
              id="email"
              className={`${changeDetails ? "profileEmailActive" : "profileEmail"} focus:outline-none`}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;
