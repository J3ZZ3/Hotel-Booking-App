import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './ClientStyles/Profile.css'; // Create this CSS file for styling
import { useAuth } from '../../context/AuthContext'; // Import the Auth context
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Profile = () => {
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        contactNumber: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const auth = getAuth();
    const { currentUser } = useAuth(); // Get current user from context
    const navigate = useNavigate(); // Get navigate function

    useEffect(() => {
        if (!currentUser) {
            navigate("/client-login"); // Redirect if not logged in
        }
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, 'users', user.uid); // Assuming user data is stored in 'users' collection
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    setError('No user data found');
                }
            }
            setLoading(false);
        };

        fetchUserData();
    }, [currentUser, navigate, auth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, userData);
            alert('Profile updated successfully!');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={userData.fullName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div>
                    <label>Contact Number:</label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={userData.contactNumber}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
