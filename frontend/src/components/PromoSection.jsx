import React from "react";

const PromoSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-10 bg-white text-center">
      <div className="mx-4 border-r-2">
        <p className="text-gray-500">Return when you're ready</p>
        <p className="font-bold">36 days of free returns</p>
      </div>
      <div className="mx-4">
        <p className="text-gray-500">Sign up for our newsletter</p>
        <p className="font-bold">36% off your first order</p>
      </div>
    </div>
  );
};


export default PromoSection;
