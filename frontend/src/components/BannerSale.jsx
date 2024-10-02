import React from "react";
import { Link } from "react-router-dom";

const SaleBanner = () => {
  return (
    <div className="bg-white mt-20 py-16">
      <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Enjoy 36% off during our exclusive one-time sale</h2>
        <p className="mt-4 text-lg text-gray-500">Most of our products are limited editions that won't return. Grab your favorites while they're still available.</p>
        <div className="mt-8">
          <Link to="/all-category" href="#" className="inline-block bg-gray-900 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-gray-700">
            Buy Now !!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SaleBanner;
