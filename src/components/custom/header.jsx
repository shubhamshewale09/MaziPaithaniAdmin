import UserMenu from "./NavMenu";



const Header = ({ selectedMenu, onToggle }) => {
    return (
        <header className="bg-background-muted flex items-center justify-between p-2 shadow">
            {/* Left: Sidebar toggle + Menu Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggle}
                    className="p-2 rounded hover:bg-gray-200 transition"
                >
                    {/* Hamburger */}
                    <span className="block w-6 h-0.5 bg-text-primary mb-1"></span>
                    <span className="block w-6 h-0.5 bg-text-primary mb-1"></span>
                    <span className="block w-6 h-0.5 bg-text-primary"></span>
                </button>

                <h1 className="text-xl font-semibold text-text-primary">
                    {selectedMenu}
                </h1>
            </div>

            {/* Right: Notifications + Profile */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                {/* <button className="relative p-2 rounded hover:bg-gray-200 transition">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                    <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                </button> */}

                {/* User Profile Menu */}
                <UserMenu />
            </div>
        </header>
    );
};

export default Header;
