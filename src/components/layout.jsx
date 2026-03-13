import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./custom/Sidebar";
import Header from "./custom/header";
import MetaTitle from "./custom/MetaTitle";

const SIDEBAR_WIDTH = 256;

const Layout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState("");

    return (
        <div className="flex min-h-screen ">
            {/* Sidebar */}
            <Sidebar
                isOpen={isOpen}
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
            />

            {/* Main Content */}
            <div
                className="flex-1 flex flex-col transition-all duration-300 overflow-auto "
                style={{ marginLeft: isOpen ? `${SIDEBAR_WIDTH}px` : "64px", height: "100vh" }}
            >
                {/* Sticky Header */}
                <Header
                    selectedMenu={selectedMenu}
                    onToggle={() => setIsOpen(!isOpen)}
                    className="sticky top-0 z-30 bg-red shadow"
                />

                {/* Scrollable Content */}
                <main className="flex-1 overflow-auto p-2 bg-white-50">
                    <MetaTitle title={selectedMenu} />
                    <Outlet />
                </main>
            </div>
        </div >
    );
};

export default Layout;