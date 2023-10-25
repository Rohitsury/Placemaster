import React, { useEffect, useState } from 'react';
import Navbar from '../Component/Navbar';

function FetchProfile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('jwttoken');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/student/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setProfile(data.profile);
        } else {
          console.error('Error fetching profile:', data);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <>
    <Navbar/>
      {profile ? (
        <div>
          <h2>Profile</h2>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          {/* Add more profile fields as needed */}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </>
  );
}

export default FetchProfile;
