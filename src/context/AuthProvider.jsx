import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { auth } from '../config/firebase.config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import axiosSecure from '../api/axiosSecure';
// import axiosInstance from '../api/axiosInstance';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    //Sign in user with email and password
    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
            .finally(() => {
                setLoading(false);
            });
    }

    //Google sign in
    const signInWithGoogle = () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider)
            .finally(() => {
                setLoading(false);
            });
    
    };

    //Sign out user
    const signOutUser = async() => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    // Set user state when auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            currentUser? console.log('Current user from observer:', currentUser): console.log('No user is signed in');
            setUser(currentUser);
            setLoading(false);

            // If user is logged in, exchange Firebase ID token for JWT
            if (currentUser) {
              try {
                const idToken = await currentUser.getIdToken();
                await axiosSecure.post('/jwt', {}, {
                  headers: {
                    Authorization: `Bearer ${idToken}`
                  }
                }).then(res => {
                    console.log('token after jwt', res.data);
                }).catch(err => {
                    console.error('Error fetching JWT token:', err);
                });
                // Now your JWT httpOnly cookie is set!
              } catch (err) {
                console.error('Error fetching JWT token:', err);
              }
            }
        });
        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        setLoading,
        createUser,
        setUser,
        signInUser,
        signInWithGoogle,
        signOutUser,
        
    }

    return (
        <AuthContext value={authInfo}>
            { children}
        </AuthContext>
    );
};

export default AuthProvider;