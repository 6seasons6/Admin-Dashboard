import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { YouTube, Facebook, LinkedIn, Twitter, Instagram } from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import "./Socialmedia.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const SocialmediaApp = () => {
  const [metrics, setMetrics] = useState({
    youtube: { followers: 0, views: 0 },
    facebook: { followers: 0, reach: 0 },
    twitter: { followers: 0, engagement: 0 },
    linkedin: { followers: 0, clicks: 0, shares: 0 },
    instagram: { followers: 0, posts: 0, engagement: 0 },
  });

  const [shares, setShares] = useState(0); // Changed to hold a number value
  const [change, setChange] = useState(0);
  const [twitterStats, setTwitterStats] = useState({ followers: 0, engagement: 0 });
  const [instagramStats, setInstagramStats] = useState({ followers: 0, posts: 0, engagement: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/social-metrics");
        setMetrics(response.data);

        const shareResponse = await axios.get("http://localhost:5000/api/linkedin-shares");
        setShares(shareResponse.data.shares);  // Ensure it's a number
        setChange(shareResponse.data.change);

        const twitterResponse = await axios.get("http://localhost:5000/api/twitter-stats");
        setTwitterStats(twitterResponse.data);

        const instagramResponse = await axios.get("http://localhost:5000/api/instagram-stats");
        setInstagramStats(instagramResponse.data);

      } catch (error) {
        console.error("Error fetching social media data", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const youtubeViewsData = {
    labels: ["01-06", "05-06", "10-06", "15-06", "20-06", "25-06", "30-06"],
    datasets: [
      {
        label: "Views",
        data: metrics.youtube.views || [1200, 1500, 800, 1400, 900, 1600, 1300],
        backgroundColor: ["#FF0000"],
      },
    ],
  };

  const facebookReachData = {
    labels: ["01-04", "01-05", "01-06"],
    datasets: [
      {
        label: "Daily Reach",
        data: metrics.facebook.reach || [3000, 12000, 18000],
        borderColor: "#1877F2",
        backgroundColor: "rgba(24, 119, 242, 0.2)",
        fill: true,
      },
    ],
  };

  const linkedinData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Clicks",
        data: metrics.linkedin.clicks || [400, 600, 800, 700, 500, 900, 750, 850, 950, 1000, 870, 920],
        backgroundColor: "#0077B5",
      },
      {
        label: "Likes",
        data: metrics.linkedin.shares || [300, 500, 700, 600, 400, 800, 650, 750, 850, 900, 770, 820],
        backgroundColor: "#FFA500",
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="card">
      <h1>SOCIAL MEDIA DASHBOARD</h1>

      <div className="stats-grid">
        <div className="stat-card youtube"><YouTube /><h3>{metrics.youtube.followers}</h3><span>Subscribers</span></div>
        <div className="stat-card facebook"><Facebook /><h3>{metrics.facebook.followers}</h3><span>Followers</span></div>
        <div className="stat-card twitter"><Twitter /><h3>{metrics.twitter.followers}</h3><span>Followers</span></div>
        <div className="stat-card linkedin"><LinkedIn /><h3>{metrics.linkedin.followers}</h3><span>Followers</span></div>
        <div className="stat-card instagram"><Instagram style={{ color: "#1DA1E2", fontSize: 20 }} /><h3>{metrics.instagram.followers}</h3><span>Followers</span></div>
      
      <div className="Linked-stat">
      <Box sx={{ backgroundColor: "#0077B5", color: "white", padding: "15px", border:"18px", width: "250px" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>LinkedIn Shares</Typography>
          <Typography variant="h1" sx={{ fontWeight: "bold" }}>{shares || 0}</Typography>
          <Typography variant="body2">Shares last month</Typography>
          <Typography variant="body2" sx={{ fontSize: "20px", fontWeight: "bold" }}>{change}% ▲</Typography>
          <Typography variant="body2">vs previous month</Typography>
        </Box>
      </div>
      <div className="Twit-stat">
      <Box sx={{ backgroundColor: "#1DA1F2", color: "white", padding: "15px", borderRadius: "10px", width: "250px" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>Twitter Stats</Typography>
          <Typography variant="h2" sx={{ fontWeight: "bold"}}>{twitterStats.followers || 0}</Typography>
          <Typography variant="body2">Followers</Typography>
          <Typography variant="h2" sx={{ fontWeight: "bold" }}>{twitterStats.engagement || 0}</Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>Engagements</Typography>
        </Box>
        </div>
        </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h4>YouTube Channel Views</h4>
          <Bar data={youtubeViewsData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className="chart-box">
          <h4>Facebook Daily Reach (90 days)</h4>
          <Line data={facebookReachData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>

        <div className="chart-box">
          <h4>LinkedIn Clicks and Likes</h4>
          <Bar data={linkedinData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
        <div className="Insta-stat">
       <Box sx={{ backgroundColor: "#C13584", color: "white", padding: "15px", border: "10px", width: "200px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Instagram Overview</Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>{instagramStats.followers || 0}</Typography>
          <Typography variant="body2">Followers</Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>{instagramStats.posts || 0}</Typography>
          <Typography variant="body2">Posts</Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>{instagramStats.engagement || 0}</Typography>
          <Typography variant="body2">Engagements</Typography>
        </Box>
       </div>
      </div>
    </div>
    </div>
  );
};

export default SocialmediaApp;
