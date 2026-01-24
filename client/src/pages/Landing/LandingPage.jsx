import styles from './landingpage.module.css';
import LandingHeader from './components/Header/LandingHeader';
import img from '../Landing/assets/background_img.jpg'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ui_img from '../Landing/assets/ui.png'
import realtime_img from '../Landing/assets/real_time.png'
import coins_img from '../Landing/assets/coins.png'
import P1 from '../Landing/assets/P1.png'
import P2 from '../Landing/assets/P2.png'
import P3 from '../Landing/assets/P3.png'
import P4 from '../Landing/assets/P4.png'


const LandingPage = () => {

    const navigate = useNavigate();

    return (
        <div className={styles.landing_page}>
            <LandingHeader />
            <div className={styles.filler}></div>

            <div className={styles.hero_section}>
                <div className={styles.hero_text}>
                    <div className={styles.textBox}>
                        <p>The newest crypto trading platform!</p>
                    </div>
                    <div className={styles.textBox}>
                        <p>Want to practice crypto trading? <br/> Start learning with our demo account!</p>
                        <motion.button onClick={() => navigate('/login')} whileHover={{ scale: 0.95 }}>Start Trading</motion.button>
                    </div>
                    

                </div>
                <div className={styles.hero_image}>
                    <motion.img src={img} alt="Image with a crypto coin" transition={{ duration: 1, ease: 'easeInOut' }}/>
                </div>
            </div>

            <div className={styles.filler}></div>

            <div className={styles.about_section}>
                <div className={styles.textBox}><h1>Features</h1></div>
                <div className={styles.about_content}>
                    <motion.div className={styles.feature_card}>
                        <h2>Intuitive User Interface</h2>
                        <div className={styles.feature_card_container}>
                            <div className={styles.img_container}>
                                <img src={ui_img} alt="UI" />
                            </div>
                            <div className={styles.textBox}>
                                <p>Easily navigate our platform with a clean and modern design.</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div className={styles.feature_card}>
                        <h2>Real-time Updates</h2>
                        <div className={styles.feature_card_container}>
                            <div className={styles.img_container}>
                                <img src={realtime_img} alt="Real-time" />
                            </div>
                            <div className={styles.textBox}>
                                <p>Make timely decisions with access to real-time data</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div className={styles.feature_card}>
                        <h2>Over 20+ E-Coins!</h2>  
                        <div className={styles.feature_card_container}>
                            <div className={styles.img_container}>
                                <img src={coins_img} alt="Coins" />
                            </div>
                            <div className={styles.textBox}>
                                <p>Diversify your portfolio with our extensive selection of cryptocurrencies</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className={styles.filler}></div>

            <div className={styles.our_team_section}>
                <h1>Our Team</h1>
                <div className={styles.person_card_container}>
                    <div className={styles.person_card}>
                        <motion.div className={styles.card} whileHover={{ width: '35%', marginRight: '1%' }}>
                            <h2>Ian De Guzman</h2>
                            <h4>Core Developer</h4>
                            <div className={styles.image_section}>
                                <div className={styles.image_container}>
                                    <img src={P1} alt="Ian De Guzman" />
                                </div>
                            </div>
                        </motion.div>
                        <motion.div className={styles.card} whileHover={{ width: '35%', marginRight: '1%', marginLeft: '1%' }}>
                            <h2>Eman Zapanta</h2>
                            <h4>Frontend Developer</h4>
                            <div className={styles.image_section}>
                                <div className={styles.image_container}>
                                    <img src={P2} alt="Eman Zapanta" />
                                </div>
                            </div>
                        </motion.div>
                        <motion.div className={styles.card} whileHover={{ width: '35%', marginRight: '1%', marginLeft: '1%' }}>
                            <h2>Marc Ferrer</h2>   
                            <h4>Designer</h4>
                            <div className={styles.image_section}>
                                <div className={styles.image_container}>
                                    <img src={P3} alt="Marc Ferrer" />
                                </div>
                            </div>
                        </motion.div>
                        <motion.div className={styles.card} whileHover={{ width: '35%', marginLeft: '1%' }}>
                            <h2>Joaquin Cabasal</h2>
                            <h4>Designer</h4>
                            <div className={styles.image_section}>
                                <div className={styles.image_container}>
                                    <img src={P4} alt="Joaquin Cabasal" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;