import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function EditarIncidente() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {};

    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        estado: "Pendiente",
        residente_nombre: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarIncidente = async () => {
        console.log("ID recibido:", id);
        try {
            const response = await axios.get(`http://localhost:3002/api/incidencias/${id}`);
            console.log("Respuesta del servidor:", response.data);
            const incidente = response.data.data;
        setFormData({
            titulo: incidente.titulo,
            descripcion: incidente.descripcion,
            estado: incidente.estado,
            residente_nombre: incidente.residente_nombre
        });
        setLoading(false);
        } catch (error) {
        console.error("Error al cargar la incidencia:", error);
        setError("Error al cargar la incidencia. Por favor, intente de nuevo.");
        setLoading(false);
        }
    };

    if (id) {
        cargarIncidente();
    } else {
        setLoading(false);
        setError("No se proporcionó un ID de incidencia válido.");
    }
    }, [id]);

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3002/api/incidencias/${id}`, formData);
            navigate("/");
        } catch (error) {
            console.error("Error al actualizar la incidencia:", error);
            setError("Error al actualizar la incidencia. Por favor, intente de nuevo.");
        }
    };

    if (loading) {
        return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-xl text-gray-600">Cargando...</div>
        </div>
    );
    }

    if (error) {
        return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-xl text-red-600">{error}</div>
        </div>
    );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        {/* Header */}
        <header className="w-full max-w-2xl flex justify-between items-center mb-8">
            <button
            onClick={() => navigate("/")}
            className="flex items-center px-4 py-2 text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
            <span className="mr-2">←</span>
            Volver a incidencias
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
            Editar Incidencia
            </h1>
        </header>

        {/* Form */}
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                Título
            </label>
            <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
            />
            </div>

          {/* Descripción */}
            <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                </label>
                <textarea
                id="descripcion"
                name="descripcion"
                rows="4"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
                ></textarea>
            </div>

            {/* Estado */}
            <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
                </label>
                <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Resuelto">Resuelto</option>
                </select>
            </div>

            {/* Residente */}
            <div>
                <label htmlFor="residente_nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Residente
                </label>
                <input
                type="text"
                id="residente_nombre"
                name="residente_nombre"
                value={formData.residente_nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
                />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-4">
                <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                Cancelar
            </button>
            <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Guardar cambios
            </button>
            </div>
        </form>
        </div>
    </div>
);
}
