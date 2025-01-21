import React from 'react';

import Grid from '@mui/material/Grid2'
import { Box, Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import LocationOnIcon from '@mui/icons-material/LocationOn';

 
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
function Graphs() {
  return (
      <div>
          <Grid container spacing={2}>
              <Grid size={{ xs: 6, md: 4 }}>
                  <Box sx={{ minWidth: 275 }}>
                      <Card variant="outlined">
                          <CardContent sx={{ height: 100 }}>
                              <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }} align='left'>
                                  Daily Sales
                              </Typography>
                              <Typography sx={{ color: 'text.secondary', mb: 1.5, display: 'flex', justifyContent: 'space-between' }} >
                                  <div><NorthIcon color='primary'></NorthIcon> $249.95</div>
                                  <div><small>67%</small></div></Typography>
                              <LinearProgress variant="determinate" value={67} />
                          </CardContent>
                      </Card>
                  </Box>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                  <Box sx={{ minWidth: 275 }}>
                      <Card variant="outlined">
                          <CardContent sx={{ height: 100 }}>
                              <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }} align='left'>
                                  Monthly Sales
                              </Typography>
                              <Typography sx={{ color: 'text.secondary', mb: 1.5, display: 'flex', justifyContent: 'space-between' }} >
                                  <div><SouthIcon color='error'></SouthIcon> $2.942.32</div>
                                  <div><small>36%</small></div></Typography>
                              <LinearProgress variant="determinate" value={36} color='secondary' />
                          </CardContent>
                      </Card>
                  </Box>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                  <Box sx={{ minWidth: 275 }}>
                      <Card variant="outlined">
                          <CardContent sx={{ height: 100 }}>
                              <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }} align='left'>
                                  Yearly Sales
                              </Typography>
                              <Typography sx={{ color: 'text.secondary', mb: 1.5, display: 'flex', justifyContent: 'space-between' }} >
                                  <div><NorthIcon color='primary'></NorthIcon> $8.638.32</div>
                                  <div><small>80%</small></div></Typography>
                              <LinearProgress variant="determinate" value={80} />
                          </CardContent>
                      </Card>
                  </Box>
              </Grid>
              <Grid size={{ xs: 6, md: 8 }}>
                  <Box sx={{ minWidth: 275 }}>
                      <Card variant="outlined">
                          <CardContent sx={{ height: 390 }} >
                              <Typography variant='h5'>Recent Users</Typography>
                              <TableContainer component={Paper}>
                                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                      
                                      <TableBody>
                                          {rows.map((row) => (
                                              <TableRow
                                                  key={row.name}
                                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                              >
                                                  <TableCell component="th" scope="row">
                                                      <AccountCircleIcon></AccountCircleIcon>
                                                  </TableCell>
                                                  <TableCell align="right">{row.name} <br/> <small>Small text</small></TableCell>
                                                  <TableCell align="right">17 Jan 2025</TableCell>
                                                  <TableCell align="right"><Button variant="contained" color='secondary' sx={{borderRadius:100}}>Reject</Button> <Button variant="contained" sx={{borderRadius:100}}>Approve</Button></TableCell>
                                                  
                                              </TableRow>
                                          ))}
                                      </TableBody>
                                  </Table>
                              </TableContainer>
                          </CardContent>
                      </Card>
                  </Box>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                  <Box sx={{ minWidth: 275 }}>
                      <Card variant="outlined">
                          <CardContent>
                              <Typography gutterBottom sx={{ color: 'text.secondary', display:'flex', justifyContent:'space-between'}} variant='h5'>
                                 Upcoming Events <Button variant="contained" color='secondary' sx={{borderRadius:100}}>34%</Button>
                              </Typography>
                              <Typography sx={{ color: 'text.secondary', mb: 1.5 }} variant='h4'>45 <small>Competitors</small></Typography>
                              <Typography variant="body2">
                                 You can participate in event
                              </Typography>
                          </CardContent>
                        
                      </Card>
                  </Box>
                  <Box sx={{ minWidth: 275, marginTop: 2 }}>
                      <Card variant="outlined">
                          <CardContent sx={{display:'flex', alignItems:'center'}}>
                              <BoltIcon color='primary' sx={{fontSize:40}}/>
                              <div>
                              <Typography gutterBottom sx={{ color: 'text.secondary'}} variant='h4'>
                                 235
                              </Typography>
                              <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>TOTAL IDEAS</Typography>
                              </div>                    
                          </CardContent>
                          <CardContent sx={{display:'flex', alignItems:'center'}}>
                              
                              <LocationOnIcon color='primary' sx={{fontSize:40}}/>
                              <div>
                              <Typography gutterBottom sx={{ color: 'text.secondary'}} variant='h4'>
                                 26
                              </Typography>
                              <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>TOTAL LOCATIONS</Typography>
                              </div>                    
                          </CardContent>
                         
                      </Card>
                  </Box>
              </Grid>
          </Grid>
      </div>
  )
}

export default Graphs;
