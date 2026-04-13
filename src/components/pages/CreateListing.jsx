import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db, auth } from "../../firebase.config";
import Spinner from "../Spinner";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

import axios from "axios";

function CreateListing() {
  const [loading, setLoading] = useState(false);
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({
            ...formData,
            userRef: user.uid,
          });
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum of 6 Images");
      return;
    }

    // Get Geolocation if enabled
    let geolocation = {};
    let location;

    if (geolocationEnabled) {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

      const response = await fetch(url);
      const data = await response.json();

      geolocation.lat = data[0]?.lat ?? 0;
      geolocation.lng = data[0]?.lon ?? 0;

      location =
        data[0] === null || data[0] === undefined
          ? undefined
          : data[0]?.display_name;

      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("Please enter a correct address");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    // Calling the upload function
    const imageUrls = await uploadToCloudinary(images);

    const formDataCopy = {
      ...formData,
      geolocation,
      imageUrls,
      timestamp: serverTimestamp(),
    };

    formDataCopy.location = address;
    delete formDataCopy.images;
    delete formDataCopy.address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    toast.success("Listing saved");

    setLoading(false);
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  // Store image in cloudinary
  const uploadToCloudinary = async (images) => {
    const cloudinaryName = "djn8ilhlu";
    const uploadPreset = "multiple-uploads";

    if (images.length > 6) {
      toast.error("Max upload is 6");
      setLoading(false);
      return;
    }

    if (images.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Create an array to track the percentage of each individual file
      const progressArray = new Array(images.length).fill(0);

      const uploadPromises = images.map(async (file, index) => {
        const imageFormData = new FormData();
        imageFormData.append("file", file);
        imageFormData.append("upload_preset", uploadPreset);

        // 2. Use Axios with the onUploadProgress configuration
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`,
          imageFormData, // Axios sends this as the request body
          {
            onUploadProgress: (progressEvent) => {
              // Calculate percentage for this specific file
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );

              // Update this file's progress in our tracking array
              progressArray[index] = percentCompleted;

              // 3. Calculate the overall average for the UI progress bar
              const totalProgress = Math.round(
                progressArray.reduce((a, b) => a + b, 0) / images.length,
              );

              // Update your state variable here
              setUploadProgress(totalProgress);
            },
          },
        );

        // Axios stores the response in .data
        return response.data.secure_url;
      });

      const results = await Promise.all(uploadPromises);
      console.log("Uploaded URLs:", results);

      return results;
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setIsUploading(false);
      setLoading(true);
    }
  };

  // Handle input state changes
  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: Array.from(e.target.files),
      }));
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create a Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Sell / Rent</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "sale" ? "formButtonActive" : "formButton"}
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type="button"
              className={type === "rent" ? "formButtonActive" : "formButton"}
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="10"
            required
          />

          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <label className="formLabel">Parking spot</label>
          <div className="formButtons">
            <button
              className={parking ? "formButtonActive" : "formButton"}
              type="button"
              id="parking"
              value={true}
              onClick={onMutate}
              min="1"
              max="50"
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="parking"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              className={furnished ? "formButtonActive" : "formButton"}
              type="button"
              id="furnished"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="furnished"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              max="750000000"
              required
            />
            {type === "rent" && <p className="formPriceText">$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required={offer}
              />
            </>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg,.webp"
            multiple
            required
          />

          {/* Progress Bar Container */}
          {isUploading && (
            <div className="w-full mt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-blue-600 animate-pulse">
                  Uploading {images.length} images...
                </span>
                <span className="text-sm font-bold text-blue-700">
                  {uploadProgress}%
                </span>
              </div>

              {/* The Outer Track */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                {/* The Moving Fill */}
                <div
                  className="bg-linear-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out shadow-md"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {/* Optional: Glossy effect on the bar */}
                  <div className="w-full h-full opacity-20 bg-white bg-[linear-gradient(45deg,rgba(255,255,255,.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.2)_50%,rgba(255,255,255,.2)_75%,transparent_75%,transparent)] bg-size-[20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest">
                Please do not close the tab
              </p>
            </div>
          )}
          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
