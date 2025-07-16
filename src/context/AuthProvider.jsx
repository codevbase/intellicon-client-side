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

            // If user is logged in, exchange Firebase ID token for JWT and fetch user data
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

                // Fetch user data from backend to get role and other info
                try {
                    const userResponse = await axiosSecure.get(`/users/${currentUser.email}`);
                    const userData = userResponse.data;
                    
                    // Merge Firebase user data with backend user data
                    const enhancedUser = {
                        ...currentUser,
                        role: userData.role || 'user',
                        badge: userData.badge || 'newcomer',
                        isMember: userData.isMember || false,
                        permissions: userData.permissions || []
                    };
                    
                    setUser(enhancedUser);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    // If user doesn't exist in backend, create them
                    try {
                        const createResponse = await axiosSecure.post('/users', {
                            name: currentUser.displayName || '',
                            email: currentUser.email,
                            photoURL: currentUser.photoURL || '',
                            role: 'user'
                        });
                        
                        const enhancedUser = {
                            ...currentUser,
                            role: createResponse.data.user.role || 'user',
                            badge: createResponse.data.user.badge || 'newcomer',
                            isMember: createResponse.data.user.isMember || false,
                            permissions: createResponse.data.user.permissions || []
                        };
                        
                        setUser(enhancedUser);
                    } catch (createError) {
                        console.error('Error creating user:', createError);
                        setUser(currentUser);
                    }
                }
              } catch (err) {
                console.error('Error fetching JWT token:', err);
                setUser(currentUser);
              }
            } else {
                setUser(null);
            }
            
            setLoading(false);
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