import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase.config";
import {
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  collection,
  deleteDoc,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ListingItem from "./ListingItem";
import homeIcon from "../../assets/svg/homeIcon.svg";
import arrowRight from "../../assets/svg/keyboardArrowRightIcon.svg";
import Spinner from "../Spinner";

function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
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
      toast.error("Could not update profile");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (listingId) => {
    if (window.confirm("Do you really want to delete this Listing?")) {
      await deleteDoc(doc(db, "listings", listingId));

      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId,
      );
      setListings(updatedListings);
    }
  };

  const onEdit = async (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  useEffect(() => {
    const fetchListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc"),
      );

      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((listing) => {
        return listings.push({
          id: listing.id,
          data: listing.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchListings();
  }, [auth.currentUser.uid]);

  if (loading) return <Spinner />;

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>

        <button className="logOut" onClick={logOut}>
          Log Out
        </button>
      </header>

      <main className="mt-10">
        <div className="profileDetailsHeader container-width mx-auto">
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

        <div className="profileCard container-width mt-4 mx-auto">
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

        <Link
          to="/create-listing"
          className="createListing container-width py-4 mx-auto"
        >
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {listings && (
          <div className="container-width mx-auto">
            <p className="listingText">Your Listings</p>

            {listings.map((listing) => (
              <ListingItem
                key={listing.id}
                listing={listing.data}
                id={listing.id}
                onDelete={() => onDelete(listing.id)}
                onEdit={() => onEdit(listing.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
