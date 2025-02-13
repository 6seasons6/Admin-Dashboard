import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import axios from 'axios';

const CustomerProductAnalytics = () => {
  const [demographics, setDemographics] = useState(null);
  const [churnRate, setChurnRate] = useState(null);
  const [clv, setClv] = useState(null);
  const [returnData, setReturnData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const demoRes = await axios.get('http://localhost:5000/api/customers/demographics');
        setDemographics(demoRes.data);

        const churnRes = await axios.get('http://localhost:5000/api/customers/churn');
        setChurnRate(churnRes.data);

        const clvRes = await axios.get('http://localhost:5000/api/customers/clv');
        setClv(clvRes.data.clv);

        const returnRes = await axios.get('http://localhost:5000/api/customers/returns');
        setReturnData(returnRes.data);
      } catch (error) {
        console.error('Error fetching customer analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!demographics || !churnRate || !returnData || clv === null) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {[{
          title: 'Customer Demographics',
          component: <Bar data={{
            labels: Object.keys(demographics.ageGroups),
            datasets: [
              { label: 'Male', data: Object.values(demographics.genderData), backgroundColor: '#1E90FF' },
              { label: 'Female', data: Object.values(demographics.genderData), backgroundColor: '#FF1493' },
              { label: 'Urban', data: Object.values(demographics.locationData), backgroundColor: '#32CD32' },
              { label: 'Rural', data: Object.values(demographics.locationData), backgroundColor: '#FFA500' },
            ],
          }} />
        }, {
          title: 'Churn Rate',
          component: <Doughnut data={{
            labels: ['Active', 'Churned'],
            datasets: [{ data: [churnRate.active, churnRate.churned], backgroundColor: ['#FFA500', '#1E90FF'] }],
          }} />
        }, {
          title: 'Customer Lifetime Value (CLV)',
          component: <Typography variant="h4">${clv}</Typography>
        }, {
          title: 'Return & Refund Analysis',
          component: <Bar data={{
            labels: Object.keys(returnData),
            datasets: [{ data: Object.values(returnData), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }],
          }} />
        }].map((card, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {card.component}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CustomerProductAnalytics;
