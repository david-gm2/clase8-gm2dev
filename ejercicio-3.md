# EJERCICIO 3: Service + Middleware for error handling

## 🎯 Objetivo

Completar la arquitectura agregando:

- **Service:** Lógica de negocio sale de las rutas y se centraliza
- **Error Middleware:** Manejo centralizado de todos los errores
- **Error Mapper:** Mapeo consistente de errores a respuestas HTTP
- **Utils mejoradas:** Usar `createError()` con statusCode y type consistentes

---

## 📌 Punto de partida

Debes tener completado el **Ejercicio 2** con Model y Repository funcionando.

---

## 📂 Estructura de archivos final

```plaintext
ejercicio-3/
├── package.json
├── index.js              ← Actualizar mensaje
├── app.js                ← Actualizar (agregar middlewares de error)
├── routes/
│   └── users.routes.js   ← Simplificar (solo validar formato + llamar Service)
├── service/
│   └── users.service.js  ← NUEVO (lógica de negocio)
├── models/
│   └── user.model.js     ← Mantener del Ejercicio 2
├── repository/
│   └── user.repository.js ← Mantener del Ejercicio 2
├── middleware/
│   └── error.middleware.js ← NUEVO (manejo centralizado)
└── utils/
    ├── validation.utils.js ← REFACTORIZAR (usar createError con types)
    └── error-mapper.utils.js ← NUEVO (mapeo de errores)
```

**Cambios desde Ejercicio 2:**

- ✅ Crear `service/users.service.js` - Lógica de negocio sale de las rutas
- ✅ Crear `middleware/error.middleware.js` - Error handler centralizado
- ✅ Crear `utils/error-mapper.utils.js` - Mapear errores a HTTP
- ✅ Refactorizar `utils/validation.utils.js` - Usar `createError()` con types
- ✅ Simplificar `routes/users.routes.js` - Solo validar + llamar Service
- ✅ Actualizar `app.js` - Agregar error middlewares al final

---

## 📝 Archivos a implementar

### 1. NUEVO: `utils/error-mapper.utils.js`

**Propósito:** Mapear errores a formato consistente con statusCode.

**Debe exportar:**

#### `mapError(error)`

- **Recibe:** Cualquier error
- **Lógica:**
  1. Si tiene `error.statusCode` y `error.type` → devolverlo tal cual (errores del Service)
  2. Si no tiene statusCode → crear error 500 genérico
- **Retorna:** Error con statusCode, type y message

**Implementación simple:**

- La mayoría de errores ya vienen con `statusCode` y `type` (del Service con `createError()`)
- Solo necesita manejar errores genéricos inesperados (500)

**Tip:** Usa `createError()` de validation.utils para crear errores genéricos

---

### 2. NUEVO: `middleware/error.middleware.js`

**Propósito:** Middleware centralizado para manejar todos los errores.

**Debe exportar estas funciones:**

#### `errorHandler(err, req, res, next)`

- Middleware de error de Express (4 parámetros)
- Loguear el error en consola
- Usar `mapError()` para obtener el error con statusCode
- Enviar respuesta JSON con el statusCode correspondiente

#### `notFoundHandler(req, res)`

- Middleware para rutas no encontradas
- Enviar respuesta 404 con formato consistente
- Incluir la ruta que se intentó acceder

**Importante:** Estos middlewares deben ir al final en `app.js`.

---

### 3. NUEVO: `service/users.service.js`

**Propósito:** Toda la lógica de negocio de usuarios.

**Debe importar:**

```javascript
import { createError } from "../utils/validation.utils.js";
```

**Debe exportar estas funciones:**

#### `getAllUsersInfo()`

- **Lógica:** Obtener todos los usuarios del Repository
- **Retorna:** Array de usuarios sin passwords (usar Model)

#### `getById(id)`

- **Lógica:** Buscar usuario por ID
- **Si no existe:** lanzar `createError('Usuario no encontrado', 404, 'NOT_FOUND_ERROR')`
- **Retorna:** Usuario sin password

#### `createNewUser(userData)`

- **Recibe:** `{ nombre, email, password }`
- **Lógica:**
  1. Validar con el Model
  2. Si invalid: lanzar `createError('Datos inválidos...', 400, 'VALIDATION_ERROR')`
  3. Verificar que el email no exista (usar Repository)
  4. Si existe: lanzar `createError('El email ya está registrado', 409, 'CONFLICT_ERROR')`
  5. Crear usuario (usar Model)
  6. Guardar (usar Repository)
  7. Retornar sin password
- **Retorna:** Usuario creado sin password

#### `updateUserComplete(id, userData)`

- **Recibe:** ID y `{ nombre, email, password }`
- **Lógica:**
  1. Validar con el Model
  2. Verificar que el usuario existe (404 si no)
  3. Verificar email duplicado (409 excepto el mismo usuario)
  4. Actualizar manteniendo `id` y `createdAt` originales
  5. Retornar sin password
- **Retorna:** Usuario actualizado sin password

#### `updateUserPartial(id, userData)`

- **Recibe:** ID y `{ nombre?, email?, password? }`
- **Lógica:**
  1. Verificar que el usuario existe (404 si no)
  2. Validar solo campos proporcionados
  3. Si se actualiza email, verificar que no esté duplicado (409)
  4. Actualizar solo campos proporcionados
  5. Retornar sin password
- **Retorna:** Usuario actualizado sin password

#### `deleteUserById(id)`

- **Recibe:** ID del usuario
- **Lógica:**
  1. Verificar que existe (404 si no)
  2. Eliminar usuario (usar Repository)
  3. Retornar sin password
- **Retorna:** Usuario eliminado sin password

**Responsabilidades del Service:**

- ✅ Toda la lógica de negocio
- ✅ Verificaciones (duplicados, existencia, etc.)
- ✅ Lanzar errores con `createError()` con statusCode y type correctos
- ✅ Llamar al Repository
- ✅ Usar Model para transformaciones
- ❌ NO recibe Request ni Response de Express
- ❌ NO formatea respuestas HTTP

---

### 4. REFACTORIZAR: `routes/users.routes.js`

**Objetivo:** Simplificar drásticamente. Las rutas ahora SOLO:

1. Validan **formato** de datos (con `validation.utils.js` mejoradas)
2. Llaman al **Service** (que tiene toda la lógica de negocio)
3. Devuelven la respuesta
4. Pasan errores al middleware con `next(error)`

**Lo que sale de las rutas:**

- ❌ Verificar si el usuario existe
- ❌ Verificar si el email está duplicado
- ❌ Crear objetos de usuario
- ❌ Llamar directamente al Repository
- ❌ Transformar respuestas (quitar password)
- ❌ Manejar errores con try-catch complejo

**Lo que queda en las rutas:**

- ✅ Validar formato (campos requeridos, email válido, password válido)
- ✅ Llamar al Service
- ✅ Devolver respuesta de éxito
- ✅ Pasar errores con `next(error)`

**Cambios en cada endpoint:**

#### `POST /api/users`

```javascript
// Estructura general:
router.post("/", async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    // 1. Validar formato
    validateRequiredFields(req, ["nombre", "email", "password"]);
    validateEmail(email);
    validatePassword(password);

    // 2. Llamar al Service
    const usuario = await createNewUser({ nombre, email, password });

    // 3. Devolver respuesta
    res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      data: usuario,
    });
  } catch (error) {
    // 4. Pasar error al middleware
    next(error);
  }
});
```

#### `GET /api/users`

- Llamar a `getAllUsersInfo()`
- Sin validaciones
- Incluir `count`

#### `GET /api/users/:id`

- Convertir ID a número
- Llamar a `getById(id)`

#### `PUT /api/users/:id`

- Validar campos requeridos, email y password
- Llamar a `updateUserComplete(id, userData)`

#### `PATCH /api/users/:id`

- Validar que se envíe al menos un campo
- Validar email y password solo si se envían
- Llamar a `updateUserPartial(id, userData)`

#### `DELETE /api/users/:id`

- Llamar a `deleteUserById(id)`

**Cambios importantes:**

- Todas las rutas ahora son `async`
- Usan `next(error)` en lugar de `res.status().json()`
- No verifican duplicados ni existencia (eso lo hace Service)
- Mucho más cortas y limpias

---

### 5. ACTUALIZAR: `app.js`

**Cambios:**

1. **Importar middlewares de error:**

   ```javascript
   import {
     errorHandler,
     notFoundHandler,
   } from "./middleware/error.middleware.js";
   ```

2. **Agregar middlewares AL FINAL (después de todas las rutas):**

   - Primero: `app.use(notFoundHandler);`
   - Segundo: `app.use(errorHandler);`

3. **Actualizar mensaje:**
   ```javascript
   message: 'API Modular funcionando',
   version: '3.0',
   architecture: 'Routes → Service → Repository + Model'
   ```

**Orden correcto en `app.js`:**

```
1. Middleware básico (cors, json)
2. Rutas (GET /, /api/users)
3. notFoundHandler
4. errorHandler (siempre al final)
```

---

### 6. MANTENER: `index.js`

Solo actualizar el mensaje:

```javascript
console.log(`📁 Arquitectura completa: Routes → Service → Repository + Model`);
```

---

## 📊 Arquitectura final (flujo completo)

```
HTTP Request
    ↓
routes/users.routes.js
    ├─ Validar formato de datos (validation.utils.js)
    ↓
service/users.service.js
    ├─ Lógica de negocio
    ├─ Lanzar custom errors si hay problemas
    ↓
repository/user.repository.js
    ├─ Operaciones CRUD
    ↓
models/user.model.js
    ├─ Estructura y transformaciones
    ↓
Datos en memoria
    ↓
← Respuesta exitosa o error
    ↓
middleware/error.middleware.js (si hay error)
    ├─ Mapear error a respuesta HTTP
    ↓
HTTP Response
```

---

## 📊 Comparación de los 3 ejercicios

| Aspecto                   | Ejercicio 1                     | Ejercicio 2                            | Ejercicio 3                                                |
| ------------------------- | ------------------------------- | -------------------------------------- | ---------------------------------------------------------- |
| **Capas**                 | Routes + Utils + Data           | Routes + Model + Repository + Utils    | Routes + Service + Repository + Model + Utils + Middleware |
| **Archivos**              | 5 archivos                      | 7 archivos                             | 10 archivos                                                |
| **Datos**                 | `data/` funciones básicas       | `repository/` con funciones semánticas | Repository (sin cambios)                                   |
| **Transformaciones**      | Destructuring inline            | `Model` con funciones                  | Model (sin cambios)                                        |
| **Validaciones**          | Utils básicas + `handleError()` | Utils básicas (del Ej1)                | Utils con `createError()`                                  |
| **Email duplicado**       | if + `handleError()` en ruta    | if + `handleError()` en ruta           | `createError(..., 409, 'CONFLICT')` en Service             |
| **Usuario no encontrado** | if + `handleError()` en ruta    | if + `handleError()` en ruta           | `createError(..., 404, 'NOT_FOUND')` en Service            |
| **Formato email**         | ✅ Valida en ruta               | ✅ Valida en ruta                      | ✅ Valida en ruta (igual)                                  |
| **Longitud password**     | ✅ Valida en ruta               | ✅ Valida en ruta                      | ✅ Valida en ruta (igual)                                  |
| **Errores**               | `handleError()` en cada catch   | `handleError()` en cada catch          | Middleware centralizado                                    |
| **Lógica negocio**        | En rutas                        | En rutas                               | En Service                                                 |
| **Líneas por ruta**       | ~40 líneas                      | ~30 líneas                             | ~15 líneas                                                 |

---

## 💡 Tips importantes

1. **Errores en el Service:**

   - Lanza errores con `createError()` en el Service, no en las rutas
   - Usa `throw createError('mensaje', statusCode, 'TYPE')`, no `return res.status()`
   - Ejemplo: `throw createError('Usuario no encontrado', 404, 'NOT_FOUND_ERROR')`

2. **Async/Await:**

   - Aunque no uses Promises, marca las rutas como `async`
   - Prepara el código para cuando uses BD real

3. **Middleware de error:**

   - SIEMPRE al final de `app.js`
   - SIEMPRE después del `notFoundHandler`

4. **Service:**

   - NO recibe `req` ni `res`
   - Solo recibe datos planos
   - Solo retorna datos o lanza errores

5. **Validaciones:**
   - Formato → en Routes (con utils)
   - Negocio → en Service (duplicados, existencia, etc.)

---

## 🎓 Qué aprenderás

- ✅ Arquitectura en capas completa
- ✅ Patrón Service para lógica de negocio
- ✅ Error handling centralizado
- ✅ Custom errors tipados
- ✅ Validaciones robustas y reutilizables
- ✅ Separación de responsabilidades clara
- ✅ Código profesional y escalable
- ✅ Preparación para tests unitarios

---

## 🎉 ¡Felicitaciones!

Has construido una arquitectura completa y profesional:

- 🏗️ Arquitectura en capas bien definida
- 🛡️ Manejo robusto de errores
- ✨ Código limpio y organizado
- 🔄 Fácil de mantener y extender
- 🧪 Lista para agregar tests
- 💾 Preparada para conectar a BD real
