import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/home';
import { Cadastro } from '../pages/Cadastro/cadastro';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />  
        <Route path="/home" element={<Home />} />      
        <Route path='/cadastro' element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}
