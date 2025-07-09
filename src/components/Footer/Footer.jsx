import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-600 text-gray-200 py-10 mt-12 border-t border-gray-800">
            <div className="container w-11/12 mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                {/* Logo and Brand */}
                <div className="flex items-center mb-6 md:mb-0">
                    <img src="/logo-intellicon.png" alt="IntelliCon Logo" className="w-10 h-10 mr-2" />
                    <span className="font-bold text-xl text-cyan-400">IntelliCon</span>
                </div>
                {/* Navigation Links */}
                <ul className="flex flex-col space-x-8 space-y-2 mb-6 md:mb-0">
                    <li>
                        <a href="/" className="hover:text-cyan-400 transition-colors duration-200">Home</a>
                    </li>
                    <li>
                        <a href="/membership" className="hover:text-cyan-400 transition-colors duration-200">Membership</a>
                    </li>
                    <li>
                        <a href="/notification" className="hover:text-cyan-400 transition-colors duration-200">Notification</a>
                    </li>
                </ul>
                {/* Social Media Icons */}
                <div className="flex space-x-4 mb-6 md:mb-0">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-cyan-400 transition-colors duration-200">
                        <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-cyan-400 transition-colors duration-200">
                        <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.007-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-cyan-400 transition-colors duration-200">
                        <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.327-.025-3.037-1.849-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667H9.358V9h3.414v1.561h.049c.476-.899 1.637-1.849 3.37-1.849 3.602 0 4.267 2.369 4.267 5.455v6.285zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.771 24h20.451C23.2 24 24 23.229 24 22.271V1.723C24 .771 23.2 0 22.225 0z"/></svg>
                    </a>
                </div>
               
            </div>
             {/* Copyright */}
                <div className="text-sm text-gray-400 text-center mt-10 mb-2 mx-auto">
                    &copy; {new Date().getFullYear()} IntelliCon. All rights reserved.
                </div>
        </footer>
    );
};

export default Footer;