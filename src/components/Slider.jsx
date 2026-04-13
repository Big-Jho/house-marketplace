import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";

// import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.css";
// SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));

      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      console.log(listings);
      setListings(listings);
      setLoading(false);
    };

    getListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (listings.length === 0) {
    return <></>;
  }

  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>

        <Swiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          modules={[A11y, Autoplay]}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                  minHeight: "225px",
                }}
                className="swiperSlideDiv"
              >
                <div className="absolute bottom-0 flex flex-col gap-1 items-start justify-end w-full h-full">
                  <p className="swiperSlidePrice ml-1">
                    ${data.discountedPrice ?? data.regularPrice}{" "}
                    {data.type === "rent" && "/ month"}
                  </p>
                  <p className="swiperSlideText">{data.name}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

export default Slider;
