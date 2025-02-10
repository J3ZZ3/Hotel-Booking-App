import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Swal from "sweetalert2";
import "./AdminStyles/ManageAdmins.css";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const adminsCollection = collection(db, "admins");
      const adminSnapshot = await getDocs(adminsCollection);
      const adminList = adminSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdmins(adminList);
    } catch (error) {
      console.error("Error fetching admins:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch admins",
        confirmButtonColor: '#c0392b'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = () => {
    navigate("/add-admin");
  };

  const handleEditAdmin = (adminId) => {
    navigate(`/edit-admin/${adminId}`);
  };

  const handleDeleteAdmin = async (adminId, adminEmail) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete admin: ${adminEmail}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c0392b',
        cancelButtonColor: '#666',
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          popup: 'custom-popup'
        }
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "admins", adminId));
        setAdmins(admins.filter(admin => admin.id !== adminId));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Admin has been deleted.',
          icon: 'success',
          confirmButtonColor: '#c0392b',
          customClass: {
            popup: 'custom-popup'
          }
        });
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete admin",
        confirmButtonColor: '#c0392b',
        customClass: {
          popup: 'custom-popup'
        }
      });
    }
  };

  return (
    <div className="manage-admins-page">
      <AdminNavbar />
      <div className="manage-admins-container">
        <div className="manage-admins-header">
          <h1>Manage Administrators</h1>
          <button className="add-admin-button" onClick={handleAddAdmin}>
            Add New Admin
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="admins-grid">
            {admins.map((admin) => (
              <div key={admin.id} className="admin-card">
                <div className="admin-info">
                  <h3>{admin.firstName} {admin.lastName}</h3>
                  <p className="admin-email">{admin.email}</p>
                  <p className="admin-phone">{admin.phoneNumber || 'No phone number'}</p>
                  <p className="admin-created">
                    Joined: {new Date(admin.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="admin-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditAdmin(admin.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAdmins; 