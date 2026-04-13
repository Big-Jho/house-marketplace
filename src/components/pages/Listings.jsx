import { db, auth } from "../../firebase.config";
import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Spinner from "../Spinner";
import shareIcon from "../../assets/svg/shareIcon.svg";
import furnishIcon from "../../assets/svg/couch-solid-full.svg";
import garageParkingIcon from "../../assets/svg/warehouse-solid-full.svg";

import { Helmet } from "react-helmet-async";

import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet";
import { Popup } from "react-leaflet";

// Import swiper components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";

function Listings() {
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const docRef = doc(db, "listings", params.listingId);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());

        setLoading(false);
      }
    };

    fetchListings();
  }, [navigate, params.listingId]);

  if (loading) return <Spinner />;

  return (
    <main>
      <Helmet>
        <title>{listing.name}</title>
      </Helmet>

      {/* {Swipper} */}
      <Swiper
        modules={[Pagination, A11y, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        spaceBetween={50}
        slidesPerView={1}
      >
        {listing?.imageUrls.map((imageUrl, index) => (
          <SwiperSlide>
            <div
              className={`center center/cover no-repeat h-80`}
              style={{
                background: `url(${imageUrl}) center/cover no-repeat`,
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* swiper end */}

      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location);

          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="share" />
      </div>

      {shareLinkCopied && <p className="linkCopied">Link Copied</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.location}</p>
        {/* <div className="flex flex-row gap-4 justify-start items-center"></div> */}
        <p className="listingType">
          For {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}

        <ul className="listingDetailsList">
          <li className="listing-li-flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 24 24"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#00cc66"
              className="mr-2"
            >
              <g>
                <rect fill="none" height="24" width="24" />
              </g>
              <g>
                <g>
                  <rect fill="none" height="3" width="5" x="6" y="7" />
                  <rect fill="none" height="3" width="5" x="13" y="7" />
                  <path d="M20,10V7c0-1.1-0.9-2-2-2H6C4.9,5,4,5.9,4,7v3c-1.1,0-2,0.9-2,2v5h1.33L4,19h1l0.67-2h12.67L19,19h1l0.67-2H22v-5 C22,10.9,21.1,10,20,10z M11,10H6V7h5V10z M18,10h-5V7h5V10z" />
                </g>
              </g>
            </svg>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : "1 Bedroom"}
          </li>
          <li className="listing-li-flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 24 24"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#00cc66"
              className="mr-2"
            >
              <g>
                <rect fill="none" height="24" width="24" />
              </g>
              <g>
                <g>
                  <g>
                    <circle cx="7" cy="7" r="2" />
                  </g>
                  <g>
                    <path d="M20,13V4.83C20,3.27,18.73,2,17.17,2c-0.75,0-1.47,0.3-2,0.83l-1.25,1.25C13.76,4.03,13.59,4,13.41,4 c-0.4,0-0.77,0.12-1.08,0.32l2.76,2.76c0.2-0.31,0.32-0.68,0.32-1.08c0-0.18-0.03-0.34-0.07-0.51l1.25-1.25 C16.74,4.09,16.95,4,17.17,4C17.63,4,18,4.37,18,4.83V13h-6.85c-0.3-0.21-0.57-0.45-0.82-0.72l-1.4-1.55 c-0.19-0.21-0.43-0.38-0.69-0.5C7.93,10.08,7.59,10,7.24,10C6,10.01,5,11.01,5,12.25V13H2v6c0,1.1,0.9,2,2,2c0,0.55,0.45,1,1,1 h14c0.55,0,1-0.45,1-1c1.1,0,2-0.9,2-2v-6H20z" />
                  </g>
                </g>
              </g>
            </svg>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : "1 Bathroom"}
          </li>
          <li className="listing-li-flex">
            <img src={garageParkingIcon} alt="bedroooms" className="mr-2 w-6" />
            {listing.parking && "Parking Spot"}
          </li>
          <li className="listing-li-flex">
            <img src={furnishIcon} alt="bedroooms" className="mr-2 w-6" />
            {listing.furnished && "Furnished"}
          </li>
        </ul>

        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listings;
