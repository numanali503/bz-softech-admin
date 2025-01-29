import React, { useState } from "react";
import { Link } from "react-router-dom";
import WHITE_LOGO from "../assets/light.png";
import DARK_LOGO from "../assets/dark.png";

const Header = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    {
      name: "Mailbox",
      path: "/mailbox",
      icon: "fa-solid fa-envelope",
    },
    {
      name: "QuickDoc",
      path: "/quickdoc",
      icon: "fa-solid fa-file-medical",
      subLinks: [
        { name: "Create Document", path: "/quickdoc/create" },
        { name: "Templates", path: "/quickdoc/templates" },
        { name: "Archive", path: "/quickdoc/archive" },
      ],
    },
    {
      name: "Zatca",
      path: "/zatca",
      icon: "fa-solid fa-receipt",
      subLinks: [
        { name: "E-Invoicing", path: "/zatca/invoicing" },
        { name: "Compliance", path: "/zatca/compliance" },
        { name: "Reports", path: "/zatca/reports" },
      ],
    },
    {
      name: "Clinic Suite",
      path: "/clinic-suite",
      icon: "fa-solid fa-hospital",
      subLinks: [
        { name: "Appointments", path: "/clinic-suite/appointments" },
        { name: "Patients", path: "/clinic-suite/patients" },
        { name: "Billing", path: "/clinic-suite/billing" },
      ],
    },
  ];

  return (
    <nav className="bg-gradient-to-tl from-blue-600 to-violet-600 border-b">
      <div className="max-w-[80rem] mx-auto">
        <div className="flex items-center justify-between h-12">
          {/* Logo with separator */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
              <img src={WHITE_LOGO} alt="logo" className="h-8 w-auto" />
            </Link>
            <div className="h-8 w-px bg-white/20 mx-6 hidden lg:block"></div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 flex-1">
            {navItems.map((item) => (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className="flex items-center space-x-2 text-white hover:text-white/90"
                >
                  <i className={`${item.icon} fa-sm`}></i>
                  <span className="text-sm">{item.name}</span>
                  {item.subLinks && (
                    <i className="fa-solid fa-chevron-down text-xs ml-1"></i>
                  )}
                </Link>

                {item.subLinks && (
                  <div className="absolute left-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-white rounded-md shadow-lg py-1 border">
                      {item.subLinks.map((subLink) => (
                        <Link
                          key={subLink.path}
                          to={subLink.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right section with user info and CTA button */}
          <div className="hidden lg:flex items-center space-x-4">
            <button class="relative group inline-block py-1 px-2 text-xs text-slate-900 hover:text-slate-100 rounded-sm overflow-hidden transition duration-300 bg-white">
              <div class="absolute top-0 right-full w-full h-full bg-slate-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
              <span class="relative font-semibold ">Log out</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="text-white p-2"
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileNavOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setMobileNavOpen(false)}
        ></div>
        <nav
          className={`fixed top-0 right-0 bottom-0 w-64 bg-white transform transition-transform ease-in-out duration-300 ${
            mobileNavOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <img src={DARK_LOGO} alt="Logo" className="h-8" />
              <button
                onClick={() => setMobileNavOpen(false)}
                className="text-gray-500"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              {navItems.map((item) => (
                <div key={item.path} className="space-y-2">
                  <Link
                    to={item.path}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <i className={`${item.icon} w-5`}></i>
                    <span>{item.name}</span>
                  </Link>
                  {item.subLinks && (
                    <div className="pl-7 space-y-2">
                      {item.subLinks.map((subLink) => (
                        <Link
                          key={subLink.path}
                          to={subLink.path}
                          className="block text-sm text-gray-600 hover:text-gray-900"
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button class="mt-8 w-full py-2 px-4 bg-gradient-to-tl from-blue-600 to-violet-600 text-white rounded-sm hover:opacity-90 transition duration-200 flex items-center justify-center gap-2">
              <span>Log out</span>
              <i class="fas fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        </nav>
      </div>
    </nav>
  );
};

export default Header;
