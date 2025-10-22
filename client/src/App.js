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
          <Route path='/' element={<Login />}/>
          <Route path="/listaIncidencias" element={<ListaIncidencias />} />
          <Route path="/editarIndcidencia" element={<EditarIncidente />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
