import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyles from '@/components/GlobalStyles';
import Navibar from '@/components/Navibar';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Homepage from '@/pages/Homepage';
import { AuthProvider } from './context/AuthProvider';
import MyPage from './pages/MyPage';
import OrderPage from './pages/OrderPage';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalStyles />
        <Navibar />
        <ToastContainer position="top-center" />
        <Routes>
          <Route path="/" element={<Navigate to="/homepage" replace />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/homepage/login" element={<Login />} />
          <Route path="/order/:productId" element={<OrderPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
