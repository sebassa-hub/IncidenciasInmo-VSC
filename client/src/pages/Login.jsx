export default function App() {
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h1>
                <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
            </div>
            <form>
                <div className="mb-6">
                    <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Usuario</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-user text-gray-400"></i>
                        </div>
                        <input type="text" id="username" name="username" placeholder="Ingresa tu usuario" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required />
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Contraseña</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-lock text-gray-400"></i>
                        </div>
                        <input type="password" id="password" name="password" placeholder="Ingresa tu contraseña" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required/>
                    </div>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">Iniciar Sesión </button>
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <a href="#" className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200">
                            Regístrate
                        </a>
                    </p>
                </div>
        </form>
        </div>
    </div>
    );
}
