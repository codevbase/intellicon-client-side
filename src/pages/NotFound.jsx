import React from 'react';
import { Link } from 'react-router';
import errimage from '../assets/404pic.png';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
    return (
        <>
            <Helmet>
                <title>Page Not Found - IntelliCon Forum</title>
            </Helmet>

            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
                <img
                    src={errimage}
                    alt="404 Not Found"
                    className="w-96 mb-6 rounded-3xl"
                />

                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition"
                >
                    Go Home
                </Link>
            </div>

        </>
    );
};

export default NotFound;