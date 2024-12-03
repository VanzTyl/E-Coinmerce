// Libraries
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Global settings for css
import './global.css'

// Import Components
import CoinPage from './pages/Coins/CoinPage'
import Register from './pages/Auth/Regis/RegisPage'
import Login from './pages/Auth/Login/LoginPage'
import AboutPage from './pages/About/AboutPage'
import MainPage from './pages/Main/MainPage'

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*Always capitalize element names*/}
          <Route path="/:coinSymbol" element={<CoinPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App