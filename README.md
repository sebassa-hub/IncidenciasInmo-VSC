# IncidenciasInmo-VSC

Repositorio que contiene la aplicación cliente (React) en `client/` y el servidor Node.js en `server/`.

Estructura principal:

- `client/` - aplicación frontend creada con Create React App
- `server/` - servidor Node.js

Cómo usar (desarrollo):

1. Instalar dependencias en cliente y servidor:

   cd client; npm install
   cd ../server; npm install

2. Ejecutar en modo desarrollo:

   cd client; npm start
   cd ../server; node index.js

Enviar a GitHub:

- Crear un repositorio en GitHub (web o usando `gh cli`).
- Añadir el remote y empujar la rama principal:

  git remote add origin <url-del-repositorio>
  git push -u origin master

(Consejo: si prefieres usar `main` como rama por defecto, renombra la rama local con `git branch -M main` y empuja `main`).
