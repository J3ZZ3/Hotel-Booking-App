import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    // Query users collection to find the document with matching UID
                    const usersRef = collection(db, 'users');
                    const q = query(usersRef, where('uid', '==', user.uid));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        setUserProfile(userDoc.data());
                        setIsAuthenticated(true);
                    } else {
                        console.log("No user profile found");
                        setUserProfile(null);
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setUserProfile(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUserProfile(null);
                setIsAuthenticated(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserProfile(null);
    };

    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            userProfile, 
            isAuthenticated,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
