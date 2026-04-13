import { Link } from "react-router-dom";
import rentCategoryImage from "../../assets/jpg/rentCategoryImage.jpg";
import saleCategoryImage from "../../assets/jpg/sellCategoryImage.jpg";

import Slider from "../Slider";

function Home() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>

      <main>
        <Slider />
        {/* <SwiperComp /> */}

        <p className="exploreCategoryHeading mb-2">Categories</p>
        <div className="exploreCategories">
          <Link to={`/category/rent`}>
            <img
              src={rentCategoryImage}
              alt="rent-category-image"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Places for Rent</p>
          </Link>
          <Link to={`/category/sale`}>
            <img
              src={saleCategoryImage}
              alt="sale-category-image"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Places for Sale</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
