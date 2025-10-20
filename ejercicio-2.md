# EJERCICIO 2: Agregar Model y Repository

## 🎯 Objetivo

Refactorizar el código del **Ejercicio 1** para agregar:

- **Model:** Define estructura del usuario y funciones de transformación
- **Repository:** Capa profesional de acceso a datos con CRUD completo

Las rutas quedarán más limpias y semánticas al usar estas capas.

---

## 📌 Punto de partida

Debes tener completado el **Ejercicio 1** funcionando correctamente.

---

## 📂 Estructura de archivos

```plaintext
ejercicio-2/
├── package.json
├── index.js              ← Actualizar mensaje
├── app.js                ← Actualizar mensaje
├── routes/
│   └── users.routes.js   ← Refactorizar para usar Repository y Model
├── models/
│   └── user.model.js     ← NUEVO
├── repository/
│   └── user.repository.js ← NUEVO (reemplaza data/)
└── utils/
    └── validation.utils.js ← Mantener del Ejercicio 1
```

**Cambios desde Ejercicio 1:**

- ❌ Eliminar carpeta `data/` (funciones básicas)
- ❌ Mantener `utils/` pero sin cambios (se mejorará en Ejercicio 3)
- ✅ Crear `models/user.model.js` (nuevo)
- ✅ Crear `repository/user.repository.js` (nuevo)
- ✅ Refactorizar rutas para usar Model y Repository

---

## 📝 Archivos a implementar

### 1. NUEVO: `models/user.model.js`

**Propósito:** Definir la estructura del usuario y funciones de transformación.

**Debe exportar estas funciones:**

#### `createUser(userData)`

- **Recibe:** `{ nombre, email, password }`
- **Retorna:** Objeto usuario completo con:
  - `id` generado con `Date.now()`
  - Campos con `.trim()` aplicado
  - `createdAt` con fecha actual ISO
- **NO debe:** Guardar en ningún lado (solo crea el objeto)

#### `getUserWithoutPassword(user)`

- **Recibe:** Un usuario completo
- **Retorna:** Usuario sin el campo `password`
- **Maneja:** Si `user` es `null`, devolver `null`

#### `getUsersWithoutPassword(users)`

- **Recibe:** Array de usuarios
- **Retorna:** Array de usuarios sin passwords
- **Tip:** Usa `map()` y reutiliza la función anterior

**Responsabilidades del Model:**

- ✅ Define estructura de datos
- ✅ Crea nuevos objetos usuario
- ✅ Transforma datos (quitar password, etc.)
- ❌ NO accede a datos
- ❌ NO valida reglas de negocio
- ❌ NO guarda nada

---

### 2. NUEVO: `repository/user.repository.js`

**Propósito:** Capa de acceso a datos. Todas las operaciones CRUD sobre el array de usuarios.

**Debe tener:**

- Variable privada: `let usuarios = [];`

**Debe exportar estas funciones:**

#### Consultas (READ):

##### `findAll()`

- **Retorna:** Array completo de usuarios

##### `findById(id)`

- **Recibe:** ID de usuario
- **Retorna:** Usuario encontrado o `undefined`

##### `findByEmail(email)`

- **Recibe:** Email a buscar
- **Retorna:** Usuario encontrado o `undefined`

##### `existsByEmail(email)`

- **Recibe:** Email a verificar
- **Retorna:** `true` si existe, `false` si no

#### Creación (CREATE):

##### `save(userData)`

- **Recibe:** Objeto usuario completo (ya creado por Model)
- **Hace:** Agregar al array
- **Retorna:** El usuario guardado

#### Actualización (UPDATE):

##### `update(id, userData)`

- **Recibe:** ID y objeto con datos a actualizar
- **Hace:** Merge de datos (`{ ...usuario, ...userData }`)
- **Retorna:** Usuario actualizado o `null` si no existe

#### Eliminación (DELETE):

##### `deleteById(id)`

- **Recibe:** ID de usuario
- **Hace:** Eliminar del array
- **Retorna:** Usuario eliminado o `null` si no existe

**Responsabilidades del Repository:**

- ✅ Operaciones CRUD sobre el array
- ✅ Búsquedas y consultas
- ✅ Persistencia en memoria
- ❌ NO valida datos
- ❌ NO aplica lógica de negocio
- ❌ NO transforma datos (usa Model para eso)

---

### 3. REFACTORIZAR: `routes/users.routes.js`

**Cambios a realizar:**

1. **Importar las nuevas capas:**

   ```javascript
   import * as userRepository from "../repository/user.repository.js";
   import {
     createUser,
     getUserWithoutPassword,
     getUsersWithoutPassword,
   } from "../models/user.model.js";
   ```

2. **Eliminar imports de `data/`**

3. **Refactorizar cada endpoint:**

   **POST:**

   - Usar `userRepository.existsByEmail()` para verificar duplicados
   - Usar `createUser()` del Model para crear el objeto
   - Usar `userRepository.save()` para guardar
   - Usar `getUserWithoutPassword()` para la respuesta

   **GET all:**

   - Usar `userRepository.findAll()`
   - Usar `getUsersWithoutPassword()` para la respuesta

   **GET by ID:**

   - Usar `userRepository.findById()`
   - Usar `getUserWithoutPassword()` para la respuesta

   **PUT:**

   - Usar `userRepository.findById()` para verificar existencia
   - Usar `userRepository.findByEmail()` para verificar duplicados
   - Crear objeto completo manteniendo `id` y `createdAt` originales
   - Usar `userRepository.update()`
   - Usar `getUserWithoutPassword()` para la respuesta

   **PATCH:**

   - Usar `userRepository.findById()` para verificar existencia
   - Usar `userRepository.findByEmail()` si se actualiza email
   - Usar `userRepository.update()` con solo los campos a actualizar
   - Usar `getUserWithoutPassword()` para la respuesta

   **DELETE:**

   - Usar `userRepository.deleteById()`
   - Usar `getUserWithoutPassword()` para la respuesta

**Resultado:** Las rutas quedan más limpias y semánticas usando funciones bien nombradas.

---

### 4. ACTUALIZAR: `app.js`

Cambiar el mensaje de la ruta principal:

```javascript
app.get("/", (req, res) => {
  res.json({
    message: "API de usuarios - Ejercicio 2",
    version: "2.0",
    architecture: "Routes → Repository + Model",
    // ... resto
  });
});
```

---

### 5. ACTUALIZAR: `index.js`

Actualizar el mensaje del console.log:

```javascript
console.log(`📁 Arquitectura: Routes → Repository + Model`);
```

---

## 📊 Comparación con Ejercicio 1

| Aspecto              | Ejercicio 1                  | Ejercicio 2                         |
| -------------------- | ---------------------------- | ----------------------------------- |
| **Acceso a datos**   | Funciones básicas en `data/` | Repository profesional              |
| **Creación usuario** | Objeto literal en ruta       | Función `createUser()` del Model    |
| **Quitar password**  | Destructuring en cada ruta   | Función del Model                   |
| **Búsquedas**        | `find()`, `some()` inline    | Funciones semánticas del Repository |
| **Mantenibilidad**   | Medio                        | Mejor                               |
| **Reusabilidad**     | Baja                         | Alta                                |

---

## ✅ Validaciones que debes mantener

Las validaciones del Ejercicio 1 deben seguir funcionando:

- Campos vacíos (400)
- Email duplicado (400)
- Usuario no encontrado (404)
- Al menos un campo en PATCH (400)
- Formato de respuesta consistente
- Nunca devolver passwords

---

## 🧪 Cómo probar

**Los mismos comandos cURL del Ejercicio 1 deben funcionar igual:**

```bash
# Debe funcionar exactamente igual que antes
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"juan@test.com","password":"123456"}'

curl http://localhost:3000/api/users

# etc...
```

**Si algo no funciona igual, hay un error en la refactorización.**

---

## ✅ Checklist de completitud

Verifica que hayas implementado:

**Archivos nuevos:**

- [ i ] `models/user.model.js` con 3 funciones
- [ i ] `repository/user.repository.js` con 7 funciones

**Refactorizaciones:**

- [ i ] `routes/users.routes.js` usa Repository y Model
- [ i ] Eliminada carpeta `data/`
- [ i ] Actualizados mensajes en `app.js` e `index.js`

**Funcionalidad:**

- [ ] Todos los endpoints funcionan igual que en Ejercicio 1
- [ ] Código más limpio y semántico
- [ ] Sin código duplicado

---

## 💡 Tips

1. **El Model no guarda nada:**

   - Solo crea objetos
   - Solo transforma objetos
   - Es puro (sin efectos secundarios)

2. **El Repository solo maneja datos:**

   - No valida formato de email
   - No verifica longitud de password
   - Solo hace CRUD

3. **Las validaciones se mantienen del Ejercicio 1:**

   - Sigues usando las `utils/validation.utils.js` básicas
   - Las rutas siguen validando formato (email, password, campos requeridos)
   - En el Ejercicio 3 se mejorarán las utils y se agregará Service

4. **Naming semántico:**
   - `findById()` es más claro que `usuarios.find(u => u.id === id)`
   - `existsByEmail()` es más claro que `usuarios.some(u => u.email === email)`

---

## 🎓 Qué aprenderás

- ✅ Patrón Repository para acceso a datos
- ✅ Patrón Model para estructura
- ✅ Separación de responsabilidades
- ✅ Código más mantenible
- ✅ Naming semántico
- ✅ Refactoring sin romper funcionalidad

---

## 🚧 Limitaciones que aún persisten (desde Ejercicio 1)

- ⚠️ Validaciones básicas con `handleError()` simple
- ⚠️ Lógica de negocio en las rutas (ej: verificar duplicados, existencia)
- ⚠️ Sin custom errors tipados
- ⚠️ Sin manejo de errores centralizado con middleware
- ⚠️ Las rutas aún tienen mucha lógica

**✨ Se resolverán en el Ejercicio 3 con Service + Error handling completo.**
