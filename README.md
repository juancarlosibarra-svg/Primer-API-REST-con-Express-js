# Primer API REST con Express.js

Este proyecto consiste en una **API RESTful** básica desarrollada con **Node.js** y **Express.js** para gestionar y consultar información de alumnos.

---

## 📂 Estructura del Proyecto

Componentes principales del entorno:
* **`index.js`**: Punto de entrada de la aplicación donde se inicializa el servidor Express y se programan las rutas.
* **`package.json`**: Archivo de configuración que gestiona las dependencias del proyecto
* **`Lista de Estudiantes.xlsx`**: Un archivo de Excel que se encuentra en la raíz, desde index.js se tiene el acceso a la lista de estudiantes pero no se hacen cambios todo funciona en memoria.

---

## 🚀 Prueba del Endpoint

La API está diseñada para las operaciones básicas de un CRUD mediante los siguientes métodos HTTP:

* **`GET`**: Consultar todos o un registro de estudiantes
* **`POST`**: Agregar un estudiante nuevo
* **`PUT`**:  Actualizar un registro que ya existe
* **`DELETE`**: Eliminar un estudiante.
