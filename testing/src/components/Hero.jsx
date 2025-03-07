import React from 'react';

const Hero = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 text-center">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">Landing page title</h1>

      {/* Subheading */}
      <p className="text-gray-600 mb-6">
        Subheading that sets up context, shares more info about the website, 
        or generally gets people psyched to keep scrolling.
      </p>

      {/* Button */}
      <button className="bg-black text-white px-6 py-3 rounded mb-8">
        Button
      </button>

      {/* Hero image */}
      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
        {/* Replace the src below with your own image */}
        <img
          src="https://via.placeholder.com/800x400"
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default Hero;
