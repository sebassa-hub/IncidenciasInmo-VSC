CREATE DATABASE AdmiCondominioConceptoLife;
GO
USE AdmiCondominioConceptoLife;
GO

CREATE TABLE Propietario (
    IdPropietario INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(200) NOT NULL,
    Direccion NVARCHAR(300),
    Documento NVARCHAR(20),
    Telefono NVARCHAR(20),
    Email NVARCHAR(100)
);


CREATE TABLE EmpresaProveedora (
    IdEmpresaProveedora INT IDENTITY PRIMARY KEY,
    RazonSocial NVARCHAR(200) NOT NULL,
    RUC NVARCHAR(20) UNIQUE NOT NULL,
    Direccion NVARCHAR(300),
    Telefono NVARCHAR(20),
    Email NVARCHAR(100),
    Estado BIT DEFAULT 1   -- 1 = Activo, 0 = Inactivo
);

CREATE TABLE Empleado (
    IdEmpleado INT IDENTITY PRIMARY KEY,
    Nombres NVARCHAR(150) NOT NULL,
    Apellidos NVARCHAR(150) NOT NULL,
    DocumentoIdentidad NVARCHAR(20) UNIQUE NOT NULL,
    Cargo NVARCHAR(100) NOT NULL,   -- Ej: Administrador, Conserje, Seguridad
    Telefono NVARCHAR(20),
    Email NVARCHAR(100),
    FechaIngreso DATE NOT NULL,
    Estado BIT DEFAULT 1,           -- 1 = Activo, 0 = Inactivo
    IdEmpresaProveedora INT NULL,
    FOREIGN KEY (IdEmpresaProveedora) REFERENCES EmpresaProveedora(IdEmpresaProveedora)
);

CREATE TABLE AreaComun (
    IdAreaComun INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,        -- Ej: Ascensor, Piscina, Lobby
    Descripcion NVARCHAR(300)
);

-- ==============================
-- TABLAS DE INCIDENCIAS Y GESTIÓN
-- ==============================

CREATE TABLE Incidencia (
    IdIncidencia INT IDENTITY PRIMARY KEY,
    IdAreaComun INT NOT NULL,
    FechaReporte DATE NOT NULL,
    Descripcion NVARCHAR(500) NOT NULL,
    Urgencia NVARCHAR(50) DEFAULT 'Normal', -- Inmediata / Programada / Normal
    Prioridad NVARCHAR(50) DEFAULT 'Media', -- Alta / Media / Baja
    Estado NVARCHAR(50) DEFAULT 'Pendiente',-- Pendiente, En Proceso, Resuelto, Cerrado
    IdEmpleado INT NULL,                     -- Responsable asignado
    IdEmpresaProveedora INT NULL,            -- Empresa contratada
    FechaProgramada DATE NULL,
    FechaResolucion DATE NULL,
    FOREIGN KEY (IdAreaComun) REFERENCES AreaComun(IdAreaComun),
    FOREIGN KEY (IdEmpleado) REFERENCES Empleado(IdEmpleado),
    FOREIGN KEY (IdEmpresaProveedora) REFERENCES EmpresaProveedora(IdEmpresaProveedora)
);

CREATE TABLE AvisoIncidencia (
    IdAvisoIncidencia INT IDENTITY PRIMARY KEY,
    NumeroSolicitud NVARCHAR(50) UNIQUE NOT NULL,
    IdPropietario INT NOT NULL,
    IdAreaComun INT NOT NULL,
    FechaAviso DATE NOT NULL,
    Descripcion NVARCHAR(500) NOT NULL,
    Prioridad NVARCHAR(50) DEFAULT 'Media',   -- Alta, Media, Baja
    Estado NVARCHAR(50) DEFAULT 'Reportado',  -- Reportado, Validado, Escalado, Atendido
    IdIncidencia INT NULL,                    -- Si se convierte en incidencia oficial
    FOREIGN KEY (IdPropietario) REFERENCES Propietario(IdPropietario),
    FOREIGN KEY (IdAreaComun) REFERENCES AreaComun(IdAreaComun),
    FOREIGN KEY (IdIncidencia) REFERENCES Incidencia(IdIncidencia)
);

CREATE TABLE HistorialIntervencion (
    IdHistorial INT IDENTITY PRIMARY KEY,
    IdIncidencia INT NOT NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    Descripcion NVARCHAR(500) NOT NULL,
    IdEmpleado INT NULL,
    Costo DECIMAL(10,2) NULL,
    FOREIGN KEY (IdIncidencia) REFERENCES Incidencia(IdIncidencia),
    FOREIGN KEY (IdEmpleado) REFERENCES Empleado(IdEmpleado)
);

CREATE TABLE ConsultaPropietario (
    IdConsulta INT IDENTITY PRIMARY KEY,
    IdPropietario INT NOT NULL,
    FechaConsulta DATETIME NOT NULL DEFAULT GETDATE(),
    Pregunta NVARCHAR(500) NOT NULL,
    Respuesta NVARCHAR(500),
    FechaRespuesta DATETIME,
    Estado NVARCHAR(50) DEFAULT 'Pendiente',
    FOREIGN KEY (IdPropietario) REFERENCES Propietario(IdPropietario)
);

-- ==============================
-- TABLA DE AUDITORÍA
-- ==============================

CREATE TABLE Auditoria (
    IdAuditoria INT IDENTITY PRIMARY KEY,
    Tabla NVARCHAR(100) NOT NULL,
    IdRegistro INT NOT NULL,
    Accion NVARCHAR(50) NOT NULL,       -- INSERT, UPDATE, DELETE
    Usuario NVARCHAR(100) NOT NULL,
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    DatosPrevios NVARCHAR(MAX) NULL,
    DatosNuevos NVARCHAR(MAX) NULL
);

INSERT INTO Propietario (Nombre, Direccion, Documento, Telefono, Email) VALUES
('María González Pérez', 'Av. Los Olivos 123, Dpto 401', '45879632', '987654321', 'maria.gonzalez@email.com'),
('Carlos Rodríguez Silva', 'Jr. Las Gardenias 456, Dpto 502', '74125896', '963852741', 'carlos.rodriguez@email.com'),
('Ana María Torres López', 'Av. Principal 789, Dpto 201', '36985214', '951753824', 'ana.torres@email.com'),
('Luis Fernando Díaz Rojas', 'Calle Los Pinos 321, Dpto 301', '85214796', '987123456', 'luis.diaz@email.com'),
('Sofía Mendoza Castro', 'Urb. Las Flores 654, Dpto 101', '14725836', '964785123', 'sofia.mendoza@email.com');

INSERT INTO EmpresaProveedora (RazonSocial, RUC, Direccion, Telefono, Email, Estado) VALUES
('Seguridad Total S.A.C.', '20123456789', 'Av. Industrial 123, Lima', '014567890', 'contacto@seguridadtotal.com', 1),
('Limpieza Express E.I.R.L.', '20198765432', 'Jr. Los Jardines 456, Surco', '014589632', 'info@limpiezaexpress.com', 1),
('Administración Residencial S.A.', '20234567890', 'Av. La Marina 789, Miraflores', '014512345', 'admin@admresidencial.com', 1),
('Mantenimiento Integral SAC', '20345678901', 'Calle Los Laureles 321, San Isidro', '014523456', 'servicios@mantenimientointegral.com', 1),
('Jardinería y Paisajismo EIRL', '20456789012', 'Urb. Los Prados 654, La Molina', '014534567', 'ventas@jardineriapaisajismo.com', 0);

INSERT INTO Empleado (Nombres, Apellidos, DocumentoIdentidad, Cargo, Telefono, Email, FechaIngreso, Estado, IdEmpresaProveedora) VALUES
('Juan Carlos', 'Martínez Ríos', '45879631', 'Guardia de Seguridad', '987654321', 'juan.martinez@email.com', '2023-01-15', 1, 1),
('Rosa Elena', 'Quispe Huamán', '74125895', 'Personal de Limpieza', '963852741', 'rosa.quispe@email.com', '2023-02-01', 1, 2),
('Pedro Alberto', 'Gómez Silva', '36985213', 'Administrador', '951753824', 'pedro.gomez@email.com', '2022-11-10', 1, 3),
('Lucía Fernanda', 'Castillo Díaz', '85214795', 'Conserje', '987123456', 'lucia.castillo@email.com', '2023-03-20', 1, NULL),
('Miguel Ángel', 'Ramírez Torres', '14725835', 'Técnico de Mantenimiento', '964785123', 'miguel.ramirez@email.com', '2023-04-05', 0, 4),
('Carmen Rosa', 'Vargas Paredes', '25836914', 'Jardinero', '978456321', 'carmen.vargas@email.com', '2023-01-30', 1, 5);

INSERT INTO AreaComun (Nombre, Descripcion) VALUES
('Piscina Principal', 'Piscina olímpica con área de descanso y duchas'),
('Ascensor Torre A', 'Ascensor principal de la torre A, capacidad 8 personas'),
('Gimnasio', 'Área de ejercicio con máquinas cardiovasculares y pesas'),
('Salón de Eventos', 'Salón comunal para fiestas y reuniones con capacidad para 50 personas'),
('Lobby Principal', 'Área de recepción principal con sofás y mesas'),
('Terraza Jardín', 'Terraza en el último piso con área verde y asadores'),
('Sala de Juegos', 'Área con mesa de billar, ping pong y juegos de mesa'),
('Estacionamiento Visitantes', 'Área de estacionamiento para visitantes con 20 espacios');
