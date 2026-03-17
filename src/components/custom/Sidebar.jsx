import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    FaTachometerAlt,
    FaUsers,
    FaBusinessTime,
    FaUserShield,
    FaParking,
    FaUser
} from "react-icons/fa";
import { MdKeyboardArrowDown, MdAppSettingsAlt, MdOutlineBugReport, MdSafetyDivider, MdOutlineCategory, MdOutlineNotificationAdd, MdLocalPolice, MdMiscellaneousServices, MdHomeRepairService } from "react-icons/md";
import { PiMapPinSimpleAreaBold } from "react-icons/pi";
import { AiTwotoneAlert } from "react-icons/ai";
import { GiByzantinTemple } from "react-icons/gi";
import { MdFamilyRestroom } from "react-icons/md";
import { GoAlert } from "react-icons/go";
import { GrAggregate, GrBusinessService } from "react-icons/gr";
import { MdDynamicFeed } from "react-icons/md";
import { FaQuestion } from "react-icons/fa6";

const Sidebar = ({ isOpen, setSelectedMenu }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState(null);

    // =================== MENU CONFIG ===================
    const menus = [
        { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
        {
            name: "Users",
            icon: <FaUsers />,
            children: [
                {
                    name: "Admin Master",
                    path: "/users/admin",
                    icon: <FaUserShield />,
                },
                {
                    name: "NMC Manager",
                    path: "/users/nmc-user",
                    icon: <FaUser />,
                    routes: [
                        { path: "/users/nmc-parking-slot", name: "Parking" },
                        { path: "/users/nmc-parking-staff", name: "Parking Staff" },
                    ],
                },
                {
                    name: "Parking Manager",
                    path: "/users/parking-admin",
                    icon: <FaParking />,
                    routes: [
                        { path: "/users/parking-admin", name: "Parking Manager" },
                        { path: "/users/parking-slot", name: "Parking" },
                        { path: "/users/parking-staff", name: "Parking Staff" },
                        { path: "/users/preview-staff", name: "Assigned Staff" },
                        { path: "/users/available-parking", name: "Available Parking" },
                    ],
                },
                {
                    name: "App User",
                    path: "/users/app-user",
                    icon: <FaUser />,
                },
            ],
        },
        {
            name: "Govt. Service",
            icon: <FaBusinessTime />,
            children: [

                {
                    name: "Service",
                    path: "/service",
                    icon: <FaBusinessTime />,
                    routes: [
                        { path: "/service-languagewise", name: "Service Language-wise" },

                    ],
                },
                {
                    name: "Govt. Service Type",
                    path: "/service-type",
                    icon: <MdHomeRepairService />,
                    routes: [
                        { path: "/service-type/languagewise", name: "Govt. Service Type Language-wise" },

                    ],
                },
            ]
        },

        {
            name: "Master",
            icon: <MdAppSettingsAlt />,
            children: [
                {
                    name: "Vehicle Type",
                    path: "/master/vehicle-type",
                    icon: <FaUserShield />,
                },
                {
                    name: "Alert Type",
                    path: "/master/alert-type",
                    icon: <AiTwotoneAlert />,
                    routes: [
                        { path: "/alert-type-languagewise", name: "Alert Type Languagewise" },

                    ],
                },
                {
                    name: "Event",
                    path: "/master/event",
                    icon: <FaUserShield />,
                },
                {
                    name: "State",
                    path: "/master/state",
                    icon: <FaUserShield />,
                    routes: [
                        { path: "/master/state/languagewise", name: "State Languagewise" },
                    ]
                },
                {
                    name: "District",
                    path: "/master/district",
                    icon: <FaUserShield />,
                    routes: [
                        { path: "/district/district-languagewise", name: "District Languagewise" },
                    ]
                },
                {
                    name: "Area",
                    path: "/master/area",
                    icon: <PiMapPinSimpleAreaBold

                    />,
                    routes: [{
                        path: `/master/area/languagewise`, name: "Area Languagewise"
                    }]
                },
                {
                    name: "FAQ's",
                    path: "/master/faq",
                    icon: <FaQuestion />,
                    routes: [
                        { path: "/master/faq/languagewise", name: "FAQ's Languagewise" },
                    ]
                },
            ],
        },
        {
            name: "Alert",
            path: "/alert",
            icon: <AiTwotoneAlert />,
            routes: [
                { path: "/alert/alert-languagewise", name: "Alert Language-wise" },

            ],
        },
        {
            name: "Notification",
            path: "/notification",
            icon: <MdOutlineNotificationAdd />
        },
        {
            name: "Temple",
            path: "/temple",
            icon: <GiByzantinTemple />,
            routes: [
                { path: "/temple/temple-languagewise", name: "Temple Language-wise" },
            ],
        },

        {
            name: "Complaints",
            icon: <MdOutlineBugReport />,
            children: [

                {
                    name: "Complaint Category",
                    path: "/category",
                    icon: <MdOutlineCategory />,
                    routes: [
                        { path: "/category-languagewise", name: "Complaint Category Language-wise" },

                    ],

                },
                {
                    name: "Parking Complaints",
                    path: "/parking-complaints",
                    icon: <GoAlert />,
                    routes: [
                        // { path: "/family-safety/family-group/members", name: "Family Members" },

                    ],
                },
                {
                    name: "Police Complaints",
                    path: "/police-complaints",
                    icon: <MdLocalPolice />,
                    routes: [
                        { path: "/policeComplaints-languagewise", name: "Police Complaints language-wise" },

                    ],
                },
            ],
        },
        {
            name: "Family Safety",
            icon: <MdSafetyDivider />,
            children: [
                {
                    name: "Family Group",
                    path: "/family-safety/family-group",
                    icon: <MdFamilyRestroom />,
                    routes: [
                        { path: "/family-safety/family-group/members", name: "Family Members" },

                    ],
                },
            ],
        },
        { name: "Lost & Found", path: "/lost-and-found", icon: <FaBusinessTime /> },
        {
            name: "Services",

            icon: <MdMiscellaneousServices />,
            children: [
                {
                    name: "Service Aggregator", path: "/service-aggregator", icon: <GrBusinessService />, routes: [{
                        name: "Service Aggregator Languagewise", path: "/service-aggregator/languagewise"
                    }]
                },
                { name: "Service Aggregator Type", path: "/service-aggregator-type", icon: <GrAggregate /> },
                { name: "Amenity", path: "/amenity", icon: <MdDynamicFeed /> },
            ]
        },
    ];

    // =================== HELPERS ===================
    const getActiveSubRoute = (sub) => {
        const allRoutes = [
            { path: sub.path, name: sub.name },
            ...(sub.routes || []),
        ];

        return allRoutes
            .sort((a, b) => b.path.length - a.path.length)
            .find(route =>
                location.pathname === route.path ||
                location.pathname.startsWith(route.path + "/")
            );
    };

    const isActiveMenu = (menu) => {
        // If menu has children
        if (menu.children) {
            return menu.children.some(child => getActiveSubRoute(child));
        }

        // 🔥 If menu has routes (like Alert)
        if (menu.routes) {
            return menu.routes.some(route =>
                location.pathname === route.path ||
                location.pathname.startsWith(route.path + "/")
            );
        }

        // Default
        return (
            location.pathname === menu.path ||
            location.pathname.startsWith(menu.path + "/")
        );
    };


  
    useEffect(() => {
        menus.forEach(menu => {

            if (menu.children) {
                menu.children.forEach(sub => {
                    const activeRoute = getActiveSubRoute(sub);
                    if (activeRoute) {
                        setOpenMenu(menu.name);
                        setSelectedMenu(activeRoute.name);
                    }
                });
            }

            // 🔥 Handle root-level routes (Alert case)
            else if (menu.routes) {
                menu.routes.forEach(route => {
                    if (
                        location.pathname === route.path ||
                        location.pathname.startsWith(route.path + "/")
                    ) {
                        setSelectedMenu(route.name);
                    }
                });
            }

            else if (
                location.pathname === menu.path ||
                location.pathname.startsWith(menu.path + "/")
            ) {
                setSelectedMenu(menu.name);
            }
        });
    }, [location.pathname]);

    return (
        <div
            className="bg-background-muted shadow fixed top-0 left-0 z-20 flex flex-col transition-all duration-300"
            style={{ width: isOpen ? "256px" : "64px", height: "100vh" }}
        >
            {/* Logo */}
            <div className={`flex items-center gap-3 px-4 py-4 h-16 ${!isOpen && "justify-center"}`}>

                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                    <img src="/images/logo.png" />
                </div>
                {isOpen && <span className="text-lg font-semibold">Kumbh</span>}
            </div>

            <div className="border-b mb-4" />

            {/* Menu */}
            <div className="flex-1 px-2 overflow-y-auto sidebar-scroll">
                {menus.map(menu => (
                    <div key={menu.name}>
                        {/* MAIN MENU */}
                        <button
                            onClick={() => {

                                if (menu.children) {
                                    setOpenMenu(prev =>
                                        prev === menu.name ? null : menu.name
                                    );

                                } else {
                                    navigate(menu.path);
                                }
                            }}
                            className={`flex items-center w-full rounded-md mb-1 transition-all
  ${isOpen ? "px-2 gap-3" : "justify-center py-1"}
  ${isActiveMenu(menu)
                                    ? "bg-primary text-white"
                                    : "text-text-primary hover:bg-primary-light hover:text-white"
                                }
`}

                        >
                            <div className="w-9 h-9 flex items-center justify-center text-lg">
                                {menu.icon}
                            </div>

                            {isOpen && (
                                <>
                                    <span className="flex-1 text-left font-semibold">{menu.name}</span>
                                    {menu.children && (
                                        <MdKeyboardArrowDown
                                            className={`transition-transform ${openMenu === menu.name ? "rotate-180" : ""
                                                }`}
                                        />
                                    )}
                                </>
                            )}
                        </button>

                        {/* SUB MENU */}
                        {menu.children && openMenu === menu.name && isOpen && (
                            <div className="ml-6 mt-1 mb-2 space-y-0.5 max-w-fit">
                                {menu.children.map(sub => (
                                    <button
                                        key={sub.name}
                                        onClick={() => {
                                            navigate(sub.path);
                                        }}
                                        className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-sm transition-all
                                                ${getActiveSubRoute(sub)
                                                ? "bg-primary text-white"
                                                : "text-text-secondary hover:bg-primary-light hover:text-white"
                                            }
                                          `}
                                    >
                                        <span className="text-base">{sub.icon}</span>
                                        <span className="whitespace-nowrap ">{sub.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;