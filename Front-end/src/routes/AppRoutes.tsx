import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />        
      </Routes>
    </BrowserRouter>
  );
}
