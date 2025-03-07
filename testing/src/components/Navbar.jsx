import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b">
      {/* Left: Site name */}
      <div className="font-bold text-xl">Site name</div>

      {/* Middle: Page links */}
      <div className="space-x-4 hidden md:block">
        <a href="#" className="text-gray-600 hover:text-gray-900">Page</a>
        <a href="#" className="text-gray-600 hover:text-gray-900">Page</a>
        <a href="#" className="text-gray-600 hover:text-gray-900">Page</a>
      </div>

      {/* Right: Button */}
      <button className="bg-black text-white px-4 py-2 rounded">
        Button
      </button>
    </nav>
  );
};

export default Navbar;
