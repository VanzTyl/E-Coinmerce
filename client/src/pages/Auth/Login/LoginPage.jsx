import styles from './login.module.css'
import { motion, easeInOut, easeIn } from 'framer-motion'
import { useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate();
  const [isToastDisplayed, setIsToastDisplayed] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const toastConfig = {
    onOpen: () => setIsToastDisplayed(true), 
    onClose: () => setIsToastDisplayed(false)
  }

  const fillInMissingFields = () => {
    if (!isToastDisplayed) {
      toast.warning('Please fill in the missing fields.', {
        ...toastConfig,
        position: "top-center",
      });
    }
  }

  const successNotify = () => {
    if (!isToastDisplayed) {
      toast.success('Successfully logged in!', {
        ...toastConfig,
        position: "top-right",
      });
    }
  }

  const invalidCredentials = () => {
    if (!isToastDisplayed) {
      toast.error('Invalid credentials!', {
        ...toastConfig,
        position: "top-right",
      });
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async () => {
    if (formData.username === '' || formData.password === '') {
      fillInMissingFields();
      return;
    }
    if (!isToastDisplayed) {
      try {
        setIsLoading(true);
        const response = await axios.post("http://localhost:3000/users/login", {
          username: formData.username,
          password: formData.password
        });
        
        localStorage.setItem('token', response.data.data.token);
        
        successNotify();
        setTimeout(() => {
          navigate('/main');
        }, 1500);
      } catch (err) {
        invalidCredentials();
        console.log('Error occurred: ', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.loginPage_body}>
      <ToastContainer />
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
              transition={{ 
                delay: 1.35,
                ease: easeInOut
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
              transition={{ 
                delay: 1.55,
                ease: easeInOut
              }}
              className={styles.text}
            >
              Ready to Trade with E-Coinmerce?
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className={styles.login_section} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1.5, ease: easeIn, duration: .5}}
      >
        <div className={styles.login_modal}>
          <div className={styles.login_modal_header_section}>
            <h2>Login</h2>
          </div>

          <div className={styles.login_modal_input_section}>
            <div className={styles.login_modal_input_label}>
              Username
            </div>
            <input 
              type="text" 
              className={styles.login_modal_input_box} 
              name="username" 
              value={formData.username} 
              onChange={handleChange}
            />
            <div className={styles.login_modal_input_label}>
              Password
            </div>
            <input 
              type="password" 
              className={styles.login_modal_input_box} 
              name="password" 
              value={formData.password} 
              onChange={handleChange}
            />
            <motion.div 
              className={styles.login_modal_button} 
              whileHover={{ scale: 1.1, color: "var(--primary)", background: "var(--secondary)"}}
              onClick={handleSubmit}
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
