# EJERCICIO 1: Rutas separadas con validaciones básicas

## 🎯 Objetivo
Crear un servidor **Express** con rutas CRUD para usuarios. Separar en archivos desde el inicio aplicando buenas prácticas, pero manteniendo la lógica simple: las rutas manipulan los datos con ayuda de funciones básicas.

---

## 📌 Requisitos
- Tener **Node.js** instalado.  
- Crear un proyecto con:

```bash
npm init -y
```

- Instalar dependencias:

```bash
npm install express cors
```

- Agregar `"type": "module"` en `package.json`

---

## 📂 Estructura de archivos a crear

```plaintext
ejercicio-1/
├── package.json
├── index.js              ← Inicia el servidor
├── app.js                ← Configura Express
├── routes/
│   └── users.routes.js   ← Rutas CRUD de usuarios
├── utils/
│   └── validation.utils.js ← Funciones de validación reutilizables
└── data/
    └── users.data.js     ← Array + funciones básicas de acceso
```

---

## 📝 Archivos a implementar

### 1. `data/users.data.js`

**Propósito:** Mantener el array de usuarios y funciones básicas para manipularlo.

**Debe exportar:**
- `addUser(user)` - Agregar un usuario al array
- `getAllUsers()` - Devolver todos los usuarios
- `findUserById(id)` - Buscar un usuario por ID
- `emailExists(email)` - Verificar si un email ya existe
- `updateUserById(id, userData)` - Actualizar un usuario (merge de datos)
- `deleteUserById(id)` - Eliminar un usuario y devolverlo

**Reglas:**
- Solo manipula el array, sin validaciones
- Las funciones deben ser puras y simples

---

### 2. `utils/validation.utils.js`

**Propósito:** Funciones simples de validación de inputs y un manejador de error genérico.

**Debe exportar:**

#### `validateRequiredFields(data, requiredFields)`
Valida que todos los campos requeridos estén presentes y no estén vacíos.
```javascript
// Ejemplo de uso:
const { nombre, email, password } = req.body;
validateRequiredFields({ nombre, email, password }, ['nombre', 'email', 'password']);
// Lanza error si falta algún campo
```

#### `isValidEmail(email)`
Verifica si el formato del email es válido.
```javascript
// Ejemplo de uso:
if (!isValidEmail(email)) {
    throw new Error('Formato de email inválido');
}
```

#### `isValidPassword(password, minLength = 6)`
Verifica si la contraseña cumple con la longitud mínima.
```javascript
// Ejemplo de uso:
if (!isValidPassword(password)) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
}
```

#### `handleError(error, res)`
Manejador genérico de errores que devuelve una respuesta consistente.
```javascript
// Ejemplo de uso en catch:
catch (error) {
    handleError(error, res);
}
```

**Detalles de implementación:**
- `validateRequiredFields()` debe verificar que todos los campos existan y no estén vacíos
- `isValidEmail()` debe usar regex para validar el formato: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- `isValidPassword()` debe verificar que la longitud sea >= 6 por defecto
- `handleError()` debe:
  - Hacer console.error del mensaje
  - Determinar el statusCode basado en palabras clave del mensaje del error
  - Devolver `{ success: false, message: error.message }` con el statusCode correcto

---

### 3. `app.js`

**Propósito:** Configurar la aplicación Express (middleware, rutas, etc.)

**Debe exportar:**
- `createApp()` - Función que crea y configura la app Express

**Debe configurar:**
- Middleware `cors()`
- Middleware `express.json()`
- Ruta `GET /` que devuelva información de la API
- Ruta `/api/users` conectada al router de usuarios

**Buena práctica:** Separar la configuración del inicio del servidor permite reutilizar la app para tests.

---

### 4. `routes/users.routes.js`

**Propósito:** Definir todas las rutas CRUD de usuarios usando las funciones de validación de utils.

**Debe exportar:** Un router de Express

**Debe importar:**
```javascript
import { validateRequiredFields, isValidEmail, isValidPassword, handleError } from '../utils/validation.utils.js';
import { addUser, getAllUsers, findUserById, updateUserById, deleteUserById, emailExists } from '../data/users.data.js';
```

**Endpoints a implementar:**

#### `POST /api/users`
- Recibir: `{ nombre, email, password }`
- Validar campos requeridos con `validateRequiredFields()`
- Validar formato de email con `isValidEmail()`
- Validar longitud de password con `isValidPassword()`
- Verificar que el email no esté duplicado usando `emailExists()`
- Crear usuario con:
  - `id: Date.now()`
  - `createdAt: new Date().toISOString()`
- Guardar en el array usando `addUser()`
- Devolver usuario creado **sin password**
- Status: 201

#### `GET /api/users`
- Devolver todos los usuarios **sin passwords**
- Incluir `count` con el número de usuarios
- Status: 200

#### `GET /api/users/:id`
- Recibir ID por params (convertir a número)
- Buscar usuario por ID
- Si no existe: error 404
- Devolver usuario **sin password**
- Status: 200

#### `PUT /api/users/:id`
- Recibir: `{ nombre, email, password }` (todos requeridos)
- Validar campos requeridos
- Validar formato de email
- Validar longitud de password
- Verificar que el usuario existe (404 si no)
- Verificar que el email no esté duplicado (excepto el mismo usuario)
- Actualizar **manteniendo** `id` y `createdAt` originales
- Devolver usuario actualizado **sin password**
- Status: 200

#### `PATCH /api/users/:id`
- Recibir: `{ nombre?, email?, password? }` (al menos uno)
- Validar que se envió al menos un campo
- Verificar que el usuario existe (404 si no)
- Si se envía email, validar su formato
- Si se envía password, validar su longitud
- Si se actualiza email, verificar que no esté duplicado
- Actualizar **solo los campos enviados**
- Devolver usuario actualizado **sin password**
- Status: 200

#### `DELETE /api/users/:id`
- Recibir ID por params
- Verificar que el usuario existe (404 si no)
- Eliminar del array
- Devolver usuario eliminado **sin password**
- Status: 200

**Reglas para todas las rutas:**
- Usar `try-catch` para manejar errores
- En el `catch`, usar `handleError(error, res)` para responder
- Formato de respuesta de éxito:
  ```javascript
  {
    success: true,
    message: "Descripción",
    data: { ... }
  }
  ```
- Las validaciones lanzan errores simples con `throw new Error()`
- `handleError()` se encarga de determinar el status code y formatear la respuesta

**Flujo recomendado para POST /api/users:**
1. Extraer `{ nombre, email, password }` del `req.body`
2. Validar campos requeridos con `validateRequiredFields()`
3. Validar formato de email con `isValidEmail()`
4. Validar longitud de password con `isValidPassword()`
5. Verificar que el email no exista con `emailExists()`
6. Crear objeto usuario con `id: Date.now()` y `createdAt: new Date().toISOString()`
7. Guardar con `addUser()`
8. Eliminar password del objeto de respuesta
9. Responder con status 201 y el usuario sin password

---

### 5. `index.js`

**Propósito:** Iniciar el servidor.

**Debe:**
- Importar `createApp()` desde `app.js`
- Definir el puerto (usar 3000)
- Iniciar el servidor con `app.listen()`
- Mostrar mensaje en consola cuando inicie

---

## 🧩 Estructura de un usuario

```javascript
{
    id: 1234567890,
    nombre: "Juan Pérez",
    email: "juan@example.com",
    password: "123456",
    createdAt: "2025-01-15T10:30:00.000Z"
}
```

**Importante:** En las respuestas, **NUNCA** incluir el campo `password`.

---

## ✅ Validaciones requeridas

### Para POST y PUT (campos completos):
- `nombre` no puede estar vacío
- `email` no puede estar vacío
- `password` no puede estar vacío
- `email` no puede estar duplicado

### Para PATCH (campos opcionales):
- Al menos un campo debe ser enviado
- Si se envía `email`, verificar que no esté duplicado

### Códigos de error HTTP:
- `400` - Validación fallida (campo vacío, email duplicado, etc.)
- `404` - Usuario no encontrado
- `500` - Error del servidor

---

## 🎓 Conceptos clave aprendidos

### Separación de responsabilidades
- **Datos** (`data/users.data.js`): Solo maneja el array (CRUD básico)
- **Validaciones** (`utils/validation.utils.js`): Funciones simples de validación + manejo de errores
- **Rutas** (`routes/users.routes.js`): Orquesta el flujo y lógica de negocio
- **Configuración** (`app.js`): Setup de Express
- **Inicio** (`index.js`): Bootstrap del servidor

### Beneficios de las Utils
1. **DRY (Don't Repeat Yourself)**: No repites código de validación
2. **Mantenibilidad**: Cambias validaciones en un solo lugar
3. **Consistencia**: Manejo de errores uniforme con `handleError()`
4. **Legibilidad**: El código de las rutas es más limpio
5. **Simplicidad**: Solo lo necesario, sin complejidad innecesaria

### ¿Por qué este enfoque para el Ejercicio 1?

Este ejercicio mantiene las cosas **simples** a propósito:
- ✅ Utils solo con validaciones básicas
- ✅ Manejo de errores genérico pero efectivo
- ✅ Sin capas de abstracción complejas (Service, Repository, etc.)
- ✅ Perfecto para aprender los fundamentos

Los ejercicios siguientes agregarán más capas de abstracción y patrones avanzados. 🚀