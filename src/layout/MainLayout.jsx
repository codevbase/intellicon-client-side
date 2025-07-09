import React from 'react';
import Header from '../components/Header/Header';
import { Outlet } from 'react-router';
import Footer from '../components/Footer/Footer';

const MainLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
            
        </div>
    );
};

export default MainLayout;