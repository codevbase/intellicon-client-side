import React from 'react';

const Membership = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-center my-10">Membership Page</h1>
            <p className="text-center text-lg">Welcome to the Membership page! Here you can find information about our membership plans and benefits.</p>
            <div className="max-w-2xl mx-auto mt-10">
                <h2 className="text-2xl font-semibold mb-4">Membership Plans</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Basic Membership - $10/month</li>
                    <li>Premium Membership - $20/month</li>
                    <li>VIP Membership - $30/month</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6">Benefits:</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Access to exclusive content</li>
                    <li>Discounts on courses and events</li>
                    <li>Priority support</li>
                </ul>
            </div>
            
        </div>
    );
};

export default Membership;