import './App.css';
import EditarIncidente from './pages/EditarIncidente';
import ListaIncidencias from './pages/ListaIncidencias';
import Login from './pages/Login';
import RegistroIncidencias from './pages/RegistroIncidencias';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('IsAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/Login" />;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/" element={
            <ProtectedRoute>
              <ListaIncidencias />
            </ProtectedRoute>
            } />
          <Route path="/registro-incidencia" element={
            <ProtectedRoute>
              <RegistroIncidencias/>
            </ProtectedRoute>
            } />
          <Route path="/editar-incidencia" element={
            <ProtectedRoute>
              <EditarIncidente />
            </ProtectedRoute>
            } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
