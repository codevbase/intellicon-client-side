import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import './Header.css';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { useAnnouncements } from '../../hooks/useAnnouncements';

const Header = () => {
    const { user, signOutUser } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const { useGetAnnouncementCount } = useAnnouncements();
    const { data: countData } = useGetAnnouncementCount();
    const announcementCount = countData?.count || 0;

    const links = (
        <>
            <li>
                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
            </li>
            <li>
                <NavLink to="/membership" className={({ isActive }) => isActive ? 'active' : ''}>Membership</NavLink>
            </li>
            <li>
                <NavLink to="/notification" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="inline-flex items-center gap-1 relative">
                        {/* Notification Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {announcementCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {announcementCount}
                            </span>
                        )}
                    </span>
                </NavLink>
            </li>
            {
                user && <>   
                     <li><NavLink to="/dashboard/add-post" className={({ isActive }) => isActive ? 'active' : ''}>Add Post</NavLink></li>                 
                    <li><NavLink to="/dashboard/my-posts" className={({ isActive }) => isActive ? 'active' : ''}>My Posts</NavLink></li>                   
                </>
            }
        </>
    );

    const handleLogout = async () => {
        try {
            await signOutUser();
            // Optionally, you can redirect the user or show a success message
            toast.success('Logged out successfully!');
            navigate('/');
            
            

            setShowDropdown(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className={`shadow-3xl bg-cyan-100 sticky top-0 z-50 `}>
            <div className='w-11/12 mx-auto navbar'>
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="text-cyan-500 btn btn-ghost lg:hidden hover:bg-cyan-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className={`bg-cyan-100 menu menu-sm dropdown-content z-1 mt-3 w-52 p-2 shadow`}>
                            {links}
                        </ul>
                    </div>
                    <Link to="/" className="normal-case text-xl flex items-center justify-center">
                        <div>
                            <img src="./logo-intellicon.png" alt="logo" style={{ width: 60, height: 60 }} />
                        </div>
                        <p className={`font-bold flex flex-row justify-center items-center`}>
                            <span className='text-cyan-400'>IntelliCon</span>
                        </p>
                    </Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {links}
                    </ul>
                </div>
                <div className="navbar-end flex items-center gap-2">
                    {!user ? (
                        <>
                            <Link to="/register" className="btn btn-outline btn-secondary hover:bg-cyan-600 hover:text-white">Register</Link>
                            <Link to="/join-us" className="btn btn-outline btn-primary">Join Us</Link>
                        </>
                    ) : (
                        <div className="relative">
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="w-8 h-8 rounded-full cursor-pointer"
                                onClick={() => setShowDropdown((prev) => !prev)}
                            />
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 rounded shadow-lg z-10 bg-white py-2">
                                    <div className="px-4 py-2 text-gray-700 font-semibold cursor-default">{user.displayName}</div>
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    {user?.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Header;