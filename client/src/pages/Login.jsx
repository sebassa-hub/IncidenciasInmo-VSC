import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        axios.post('http://localhost:3002/api/iniciosesion/login', { 
            email: username,
            password: password 
        })
        .then(res => {
            console.log('Respuesta del servidor:', res.data);
            if (res.data.success) {
                // Guardar usuario
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('isAuthenticated', 'true');
                
                console.log('Login exitoso, usuario:', res.data.user);
                
                // Mostrar animación de éxito
                setUserName(res.data.user.nombre);
                setShowSuccess(true);
                
                // Redirigir según el rol después de 2 segundos
                setTimeout(() => {
                    if (res.data.user.rol === 'Administrador' || res.data.user.rol === 'ADMIN') {
                        navigate('/'); // ListaIncidencias para admin
                    } else if (res.data.user.rol === 'PROPIETARIO') {
                        navigate('/registro-incidencia'); // RegistroIncidencias para propietario
                    } else {
                        navigate('/'); // Por defecto
                    }
                }, 2000);
            } else {
                console.log('Login fallido:', res.data.message);
                alert(res.data.message);
            }
        })
        .catch(err => {
            console.error('Error en la petición:', err);
            alert('Error al conectar con el servidor');
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            {/* Notificación de éxito */}
            {showSuccess && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-fade-in-down z-50">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 mr-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <div>
                            <p className="font-semibold">¡Bienvenido {userName}!</p>
                            <p className="text-sm">Redirigiendo...</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h1>
                    <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Usuario</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-user text-gray-400"></i>
                            </div>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                placeholder="Ingresa tu usuario" 
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                required 
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-lock text-gray-400"></i>
                            </div>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Ingresa tu contraseña" 
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                required 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Iniciando sesión...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>
            </div>

            {/* Agrega estas animaciones a tu CSS o tailwind */}
            <style jsx>{`
                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}