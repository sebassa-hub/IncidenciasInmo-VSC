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
        residente_id: "",
        empleado_asignado_id: "",
        empresa_proveedora_id: ""
    });

    // Estados adicionales para los select
    const [residentes, setResidentes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [tipoAsignacion, setTipoAsignacion] = useState("sin_asignar"); // "sin_asignar", "empleado", "empresa"


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarIncidente = async () => {
        console.log("ID recibido:", id);
        try {
            const response = await axios.get(`http://localhost:3002/api/incidencias/${id}`);
            console.log("Respuesta del servidor:", response.data);
            const incidente = response.data.data;

            const [resResidentes, resEmpleados, resEmpresas] = await Promise.all([
                axios.get('http://localhost:3002/api/propietarios'),
                axios.get('http://localhost:3002/api/empleados'),
                axios.get('http://localhost:3002/api/empresas')
            ]);

            setResidentes(resResidentes.data.data || []);
            setEmpleados(resEmpleados.data.data || []);
            setEmpresas(resEmpresas.data.data || []);

            // Determinar tipo de asignación
            let tipo = "sin_asignar";
            if (incidente.empleado_asignado_id) {
                tipo = "empleado";
            } else if (incidente.empresa_proveedora_id) {
                tipo = "empresa";
            }
            setTipoAsignacion(tipo);

        setFormData({
            titulo: incidente.titulo,
            descripcion: incidente.descripcion,
            estado: incidente.estado,
            residente_id: incidente.residente_id || "",
            empleado_asignado_id: incidente.empleado_asignado_id || "",
            empresa_proveedora_id: incidente.empresa_proveedora_id || ""
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

    const handleTipoAsignacionChange = (tipo) => {
        setTipoAsignacion(tipo);
        setFormData({
            ...formData,
            empleado_asignado_id: tipo === "empleado" ? formData.empleado_asignado_id : "",
            empresa_proveedora_id: tipo === "empresa" ? formData.empresa_proveedora_id : ""
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
    <label htmlFor="residente_id" className="block text-sm font-medium text-gray-700 mb-1">
        Residente *
    </label>
    <select
        id="residente_id"
        name="residente_id"
        value={formData.residente_id}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        required
    >
        <option value="">Seleccione un residente</option>
        {residentes.map((residente) => (
            <option key={residente.IdPropietario} value={residente.IdPropietario}>
                {residente.Nombre}
            </option>
        ))}
    </select>
</div>

{/* Tipo de Asignación */}
<div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
        Asignar a
    </label>
    <div className="flex gap-4 mb-3">
        <label className="flex items-center cursor-pointer">
            <input
                type="radio"
                name="tipo_asignacion"
                value="sin_asignar"
                checked={tipoAsignacion === "sin_asignar"}
                onChange={(e) => handleTipoAsignacionChange(e.target.value)}
                className="mr-2"
            />
            <span className="text-sm text-gray-700">Sin asignar</span>
        </label>
        <label className="flex items-center cursor-pointer">
            <input
                type="radio"
                name="tipo_asignacion"
                value="empleado"
                checked={tipoAsignacion === "empleado"}
                onChange={(e) => handleTipoAsignacionChange(e.target.value)}
                className="mr-2"
            />
            <span className="text-sm text-gray-700">Empleado</span>
        </label>
        <label className="flex items-center cursor-pointer">
            <input
                type="radio"
                name="tipo_asignacion"
                value="empresa"
                checked={tipoAsignacion === "empresa"}
                onChange={(e) => handleTipoAsignacionChange(e.target.value)}
                className="mr-2"
            />
            <span className="text-sm text-gray-700">Empresa Proveedora</span>
        </label>
    </div>

    {/* Select de Empleado */}
    {tipoAsignacion === "empleado" && (
        <select
            id="empleado_asignado_id"
            name="empleado_asignado_id"
            value={formData.empleado_asignado_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
        >
            <option value="">Seleccione un empleado</option>
            {empleados.map((empleado) => (
                <option key={empleado.IdEmpleado} value={empleado.IdEmpleado}>
                    {empleado.Nombres} {empleado.Apellidos} - {empleado.Cargo}
                </option>
            ))}
        </select>
    )}

    {/* Select de Empresa */}
    {tipoAsignacion === "empresa" && (
        <select
            id="empresa_proveedora_id"
            name="empresa_proveedora_id"
            value={formData.empresa_proveedora_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
        >
            <option value="">Seleccione una empresa</option>
            {empresas.map((empresa) => (
                <option key={empresa.IdEmpresaProveedora} value={empresa.IdEmpresaProveedora}>
                    {empresa.RazonSocial}
                </option>
            ))}
        </select>
    )}
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
