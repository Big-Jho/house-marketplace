import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";

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
                <div className="absolute bottom-10 flex flex-col gap-4 items-start justify-end w-full h-full">
                  <p className="swiperSlideText">{data.name}</p>

                  <p className="swiperSlidePrice ml-2">
                    ${data.discountedPrice ?? data.regularPrice}{" "}
                    {data.type === "rent" && "/ month"}
                  </p>
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
