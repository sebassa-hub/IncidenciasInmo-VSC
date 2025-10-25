import './App.css';
import EditarIncidente from './pages/EditarIncidente';
import ListaIncidencias from './pages/ListaIncidencias';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/" element={<ListaIncidencias />} />
          <Route path="/editar-incidencia" element={<EditarIncidente />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
