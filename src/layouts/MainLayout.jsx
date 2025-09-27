import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-background p-0 relative">

      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      { (
        <main className={`flex-1 p-2 ${isMenuOpen ? "hidden" : "block"}`}>
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default MainLayout;
