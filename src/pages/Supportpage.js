import { Alert, Box, Button, Grid2, Snackbar, TextField, Typography } from '@mui/material';
import React from 'react';
import { FaFacebook, FaInstagram, FaPhone, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FaLinkedin, FaLocationDot, FaWhatsapp } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { Link } from 'react-router-dom';
import './Supportpage.css';




const Supportpage = () => {
  const [result, setResult] = React.useState("");
  const [open, setOpen] = React.useState({open:false,message:"",severity:"success"})
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "cdcace1c-f294-4379-a4a9-4a318e698217");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setOpen({open:true, message:"Sent successfullly",severity:"success"});
      setResult("Form Submitted Successfully");
      event.target.reset();

    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  
  return (
    <div>
      <Grid2 container spacing={2}>
        <Grid2 size={6}>
          <Box sx={{ p: 3 }}>
            <Typography variant='h4' align='left' sx={{ marginBottom: 2 }}>Reach Out to Us</Typography>
            <Typography variant='p'>We at 6seasonsorganic are dedicated to delivering the finest organic and seasonal products. If you have any inquiries or need assistance, feel free to reach out to us. Let's grow together sustainably.</Typography>
            <form onSubmit={onSubmit} className='form'>
              <TextField label="Your Name" name='Name' sx={{ marginBottom: 3, width: 400 }} required />
              <br />
              <TextField label="Your email" name='Email' type='email' sx={{ marginBottom: 3, width: 400 }} required />
              <br />
              <TextField label="Subject" name='Subject' sx={{ marginBottom: 3, width: 400 }} required />
              <br />
              <TextField multiline rows={4} label="Message" name='Message' sx={{ marginBottom: 3, width: 400 }} required />
              <br />
              <Button variant='contained' type='submit' onClick={handleClick}>Send Message</Button>
              <Snackbar open={open.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                  onClose={handleClose}
                  severity={open.severity}
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {open.message}
                </Alert>
              </Snackbar>
            </form>
          </Box>
        </Grid2>

        <Grid2 size={6} sx={{ p: 3, width: 500, height: 550 }} className='contact'>
          <Typography variant='h4' align='left' sx={{ marginBottom: 2 }}>Contact Info</Typography>
          <p>6seasonsorganic is committed to promoting a healthy lifestyle by providing premium organic products. We value your feedback and inquiries. Contact us for more information on our offerings or to share your suggestions.</p>


          <p><FaLocationDot />Address: 6seasonsorganic, Plot No. 45,
            <br />
            Green Valley Avenue, Hyderabad,
            <br />
            Telangana, 500032.</p>
          <p><FaPhone />Phone: +91-9100066659
            <br />
            <MdEmail /> Email: info@6seaosnsorganic.com</p>
          <Box>
            <Typography variant='h5' sx={{ color: 'blue' }}>Social Media</Typography>
            <Link className='socialmedia'><FaLinkedin /></Link>
            <Link className='socialmedia' to={'https://www.instagram.com/6_seasons_organic/?hl=en'}><FaInstagram /></Link>
            <Link className='socialmedia' to={'https://x.com/i/flow/login?redirect_after_login=%2F6seasonsorganic'}><FaTwitter /></Link>
            <Link className='socialmedia' to={'https://www.facebook.com/people/6-seasons/61552154805127/?sfnsn=wiwspmo&mibextid=vk8aRt'}><FaFacebook /></Link>
            <Link className='socialmedia' to={'https://www.youtube.com/@6seasonsorganics'}><FaYoutube /></Link>
            <Link className='socialmedia'><FaWhatsapp /></Link>
          </Box>
        </Grid2>

      </Grid2>
    </div>

  )
};

export default Supportpage;