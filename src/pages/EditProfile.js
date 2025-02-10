import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Profile.css"; // Ensure this CSS file contains the provided styles

function EditProfile() {
  const [user, setUser] = useState(null);  // Change "profile" to "user"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/EditProfile')
      .then((response) => {
        console.log('User data:', response.data);  // Log the response data for debugging
        setUser(response.data);  // Set the fetched user data to state
        setLoading(false);  // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
        setLoading(false);  // Stop loading even if there’s an error
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {user ? ( // Render user if it exists
        <div className='profile-container'>
          {/* Profile Details */}
          <div className="mt-5 bg-white p-5 rounded shadow-md profile-left">
            <div className="flex items-center">
              <img
                src={user.avatar || "https://via.placeholder.com/100"} // Fallback to placeholder if avatar is not available
                alt="Profile"
                className="profile-image"
              />
              <div className="ml-5">
                <h2 className="text-xl font-bold">{user.username || "Kamala Kadiyam"}</h2> {/* Display user name */}
                <p className="text-gray-600">{user.jobTitle || "Web Developer"}</p> {/* Display job title */}
                <div className="flex space-x-3 mt-2">
                  <i className={`fab fa-twitter text-blue-500 ${user.twitter ? "" : "hidden"}`}></i>
                  <i className={`fab fa-instagram text-pink-500 ${user.instagram ? "" : "hidden"}`}></i>
                  <i className={`fab fa-linkedin text-blue-700 ${user.linkedin ? "" : "hidden"}`}></i>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-right">
            <div className="mt-5">
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-gray-600 mt-2">
                {user.bio || "Experienced web developer with a passion for Website development and a strong focus on user-centric design."}
              </p>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-semibold">Profile Details</h3>
              <ul className="mt-2 text-gray-700">
                <li><strong>Full Name:</strong> {user.username || "Kamala Kadiyam"}</li>
                <li><strong>Company:</strong> {user.company || "6Seasons Organic"}</li>
                <li><strong>Job Title:</strong> {user.jobTitle || "Web Developer"}</li>
                <li><strong>Country:</strong> {user.country || "India"}</li>
                <li><strong>Address:</strong> {user.address || "D.no:35-2-132, 2/6 line Vengala rao nagar, Guntur 522002"}</li>
                <li><strong>Phone:</strong> {user.phone || "+91 -9014207892"}</li>
                <li><strong>Email:</strong> {user.email || "kanderson@example.com"}</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div>No user data found</div> 
      )}
    </div>
  );
}

export default EditProfile;
