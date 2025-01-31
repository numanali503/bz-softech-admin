import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import WHITE_LOGO from "../assets/light.png";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "fa-solid fa-gauge",
      subLinks: [],
    },
    {
      name: "Mailbox",
      path: "/dashboard/mailbox",
      icon: "fa-solid fa-envelope",
      subLinks: [],
    },
    {
      name: "QuickDoc",
      path: "/dashboard/quickdoc",
      icon: "fa-solid fa-file-medical",
      subLinks: [
        { name: "Create Document", path: "/dashboard/quickdoc/create" },
        { name: "Templates", path: "/dashboard/quickdoc/templates" },
        { name: "Archive", path: "/dashboard/quickdoc/archive" },
      ],
    },
    {
      name: "Zatca",
      path: "/dashboard/zatca",
      icon: "fa-solid fa-receipt",
      subLinks: [
        { name: " Users List", path: "/dashboard/zatca/users-list" },
        { name: "Platinum Users", path: "/dashboard/zatca/platinum-users" },
        { name: "Gold Users", path: "/dashboard/zatca/gold-users" },
        { name: "Payments", path: "/dashboard/zatca/payments" },
        { name: "Sales", path: "/dashboard/zatca/sales" },
      ],
    },
    {
      name: "Clinic Suite",
      path: "/dashboard/clinic-suite",
      icon: "fa-solid fa-hospital",
      subLinks: [
        { name: "Appointments", path: "/dashboard/clinic-suite/appointments" },
        { name: "Patients", path: "/dashboard/clinic-suite/patients" },
        { name: "Billing", path: "/dashboard/clinic-suite/billing" },
      ],
    },
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCategoryClick = (categoryName, event) => {
    // Prevent the Link navigation when clicking on categories with sublinks
    if (
      navItems.find((item) => item.name === categoryName)?.subLinks.length > 0
    ) {
      event.preventDefault();
      setOpenCategory(openCategory === categoryName ? null : categoryName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-slate-100 to-slate-200">
      {/* Top Gradient Design */}
      <div className="absolute top-0 left-0 right-0 h-48 rounded-b-[50px] bg-gradient-to-tl from-blue-600 to-violet-600 border-b"></div>

      {/* Main Container */}
      <div className="relative min-h-screen p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img src={WHITE_LOGO} alt="Logo" className="h-10" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <button className="relative group inline-block py-1 px-2 text-xs text-slate-900 hover:text-slate-100 rounded-sm overflow-hidden transition duration-300 bg-white">
                <div className="absolute top-0 right-full w-full h-full bg-slate-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
                <span className="relative font-semibold">Log out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-[auto_1fr] gap-6">
          {/* Sidebar */}
          <aside
            className="transition-all duration-300 ease-in-out overflow-hidden"
            style={{ width: sidebarCollapsed ? "64px" : "240px" }}
          >
            <div className="bg-[#1B3B5D]/50 rounded-2xl p-4">
              <button
                className={`mb-4 w-full flex items-center ${
                  sidebarCollapsed ? "justify-center" : "justify-end"
                } text-white`}
                onClick={toggleSidebar}
              >
                {sidebarCollapsed ? (
                  <i className="fas fa-bars"></i>
                ) : (
                  <i className="fas fa-times"></i>
                )}
              </button>
              <nav>
                <ul className="space-y-4">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <div className="relative">
                        <Link
                          to={item.path}
                          className="flex items-center gap-3 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
                          onClick={(e) => handleCategoryClick(item.name, e)}
                        >
                          <i className={item.icon}></i>
                          <span
                            className={`transition-all duration-500 ${
                              sidebarCollapsed
                                ? "opacity-0 w-0"
                                : "opacity-100 w-auto"
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.subLinks.length > 0 && !sidebarCollapsed && (
                            <i
                              className={`fa-solid fa-chevron-down text-xs ml-auto transition-transform duration-200 ${
                                openCategory === item.name ? "rotate-180" : ""
                              }`}
                            ></i>
                          )}
                        </Link>

                        {item.subLinks.length > 0 &&
                          !sidebarCollapsed &&
                          openCategory === item.name && (
                            <div className="pl-8 mt-1 space-y-1">
                              {item.subLinks.map((subLink) => (
                                <Link
                                  key={subLink.path}
                                  to={subLink.path}
                                  className="block text-sm text-white/80 hover:text-white py-1 px-2 rounded hover:bg-blue-600"
                                >
                                  {subLink.name}
                                </Link>
                              ))}
                            </div>
                          )}
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="bg-white/10 rounded-2xl overflow-hidden">
            <div className="p-2 rounded-2xl overflow-hidden">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
