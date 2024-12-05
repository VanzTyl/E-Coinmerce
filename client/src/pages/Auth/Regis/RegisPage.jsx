import styles from './regis.module.css'
// Animation Library
import { easeIn, easeInOut, motion } from "framer-motion"
// React built-in functions
import { useState } from 'react';
// Import axios for http requests and responses from server
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom';

const RegisPage = () => {

  const navigate = useNavigate();

  const [isToastDisplayed, setIsToastDisplayed] = useState(false)

  // Notification Toasts
  const fillInMissingFields = () => {
    if (!isToastDisplayed) {
        toast.warning('Please fill in the missing fields.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onOpen: () => setIsToastDisplayed(true), 
        onClose: () => setIsToastDisplayed(false)
      });
    }
  }

  const successNotify = () => {
    if (!isToastDisplayed) {
      toast.success('User successfully registered!.', {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onOpen: () => setIsToastDisplayed(true), 
        onClose: () => setIsToastDisplayed(false)
      });
    }
  }

  const userAlrExists = () => {
    if (!isToastDisplayed) {
      toast.error('User already exists!', {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onOpen: () => setIsToastDisplayed(true), 
        onClose: () => setIsToastDisplayed(false)
      });
    }
  }

  // Collection of Data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmation_pass: '',
  });

  // Function that detects the event of an input box to manipulate values inside formData
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Http request to register user
  const handleSubmit = async () => {  // Make the function async
    if (formData.username === '' || formData.password === '' || formData.confirmation_pass === '') {
      fillInMissingFields();
      return;  // Prevent submission if fields are empty
    }
    if (!isToastDisplayed) {
      try {
        const response = await axios.post("http://localhost:3000/users/register", formData); // Await the response
        console.log('Form Data: ', formData);
        console.log(response.data.message); // Now response is available
        successNotify();
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (err) {
        userAlrExists();
        console.log('Error occurred: ', err); // This will catch the 500 error or any other error
      }
    }
  };

  

  return (

    <body className={styles.regisPage_body}>
      <ToastContainer></ToastContainer>
      <div className={styles.content_section}>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ 
            duration: 1.35,
            ease: easeInOut }}
          className={styles.circle}
        >

          <div className={styles.content_header_section}>
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.35,
                transition: easeInOut
               }}
              className={styles.text}
            >
              <h1 onClick={() => navigate('/')}>E-Coinmerce</h1>
            </motion.div>
          </div>

          <div className={styles.content_lower_section}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.55,
                transition: easeInOut
               }}
              className={styles.text}
            >
              Start Trading Today By Signing Up!
            </motion.div>
          </div>

        </motion.div>

      </div>

      <motion.div className={styles.registration_section} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, ease: easeIn, duration: .5}}>

        <div className={styles.registration_modal}>

          <div className={styles.regis_modal_header_section}>
            <h2>Sign Up</h2>
          </div>

          <div className={styles.regis_modal_input_section}>
            <div className={styles.regis_modal_input_label}>
              Username
            </div>
            <input type="text" className={styles.regis_modal_input_box} name="username" value={formData.username} onChange={handleChange}  />
            <div className={styles.regis_modal_input_label}>
              Password
            </div>
            <input type="password" className={styles.regis_modal_input_box} name="password" value={formData.password} onChange={handleChange} />
            <div className={styles.regis_modal_input_label}>
              Confirm Password
            </div>
            <input type="password" className={styles.regis_modal_input_box} name="confirmation_pass" value={formData.confirmation_pass} onChange={handleChange} />
            <motion.div className={styles.regis_modal_button} whileHover={{ scale: 1.1, color: "var(--primary)", background: "var(--secondary)"}} onClick={handleSubmit}>Register</motion.div>
          </div>

        </div>

      </motion.div>

    </body>
  )
}

export default RegisPage