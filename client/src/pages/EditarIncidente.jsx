import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditarIncidente() {
const [formData, setFormData] = useState({
    id: "INC-001", // Ejemplo de ID
    titulo: "",
    descripcion: "",
    estado: "Pendiente",
});
const navigate = useNavigate();

const handleChange = (e) => {
    setFormData({
    ...formData,
    [e.target.name]: e.target.value,
    });
};

const handleSubmit = (e) => {
    e.preventDefault();
    alert("Incidente actualizado correctamente ✅");
    console.log("Datos enviados:", formData);
};

return (
    <>
    <button
        onClick={() => navigate('/')}
        style={styles.backButton}
        aria-label="Volver a la lista"
    >
        ← Volver a incidencias
    </button>
    <div style={styles.container}>
    <h2 style={styles.title}>Editar Incidente</h2>

    <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>ID del incidente</label>
        <input
            type="text"
            name="id"
            value={formData.id}
            readOnly
            style={styles.input}
        />

        <label style={styles.label}>Título</label>
        <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder=""
            style={styles.input}
        />

        <label style={styles.label}>Descripción</label>
        <textarea
            name="descripcion"
            rows="4"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder=""
            style={styles.textarea}
        ></textarea>

        <label style={styles.label}>Estado</label>
        <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            style={styles.select}
        >
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Resuelto">Resuelto</option>
        </select>

        <button type="submit" style={styles.button}>
            Guardar cambios
        </button>
    </form>
    </div>
    </>
);
}

const styles = {
backButton: {
    position: 'fixed',
    top: '18px',
    left: '18px',
    backgroundColor: '#ff6b6b',
    color: '#fff',
    padding: '14px 20px',
    fontSize: '18px',
    fontWeight: '700',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
    zIndex: 1000,
},
container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fefefe",
    fontFamily: "Arial, sans-serif",
},
title: { textAlign: "center", marginBottom: "20px" },
form: { display: "flex", flexDirection: "column", gap: "10px" },
label: { fontWeight: "bold" },
input: { padding: "8px", borderRadius: "5px", border: "1px solid #ccc" },
textarea: { padding: "8px", borderRadius: "5px", border: "1px solid #ccc" },
select: { padding: "8px", borderRadius: "5px", border: "1px solid #ccc" },
button: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
},
};

export default EditarIncidente;
