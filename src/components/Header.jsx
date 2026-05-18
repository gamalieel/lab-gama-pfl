import { FaBell, FaSearch } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";


// Header atas untuk pencarian, notifikasi, dan profil pengguna.
export default function Header({ searchValue, onSearchChange }) {
	return (
		<div id="header-container">
			{/* Search Bar */}
			<div id="search-bar">
				<input
					id="search-input"
					type="text"
					placeholder="Search Here..."
					value={searchValue}
					onChange={onSearchChange}
					aria-label="Search dashboard cards and menus"
				/>
				<FaSearch id="search-icon" />
			</div>

			{/* Icon & Profile Section */}
			<div id="icons-container">
				{/* Icons */}
				<div id="notification-icon">
					<FaBell />
					<span id="notification-badge">50</span>
				</div>
				<div id="chart-icon">
					<FcAreaChart />
				</div>
				<div id="settings-icon">
					<SlSettings />
				</div>

				{/* Profile Section */}
				<div id="profile-container">
					<span id="profile-text">
						Gacor77, <b></b>
					</span>
					<img
						id="profile-avatar"
						src="/img/Gacor77.png"
						className="w-10 h-10 rounded-full"
						alt="Profile avatar"
					/>
				</div>
			</div>
		</div>
	);
}
