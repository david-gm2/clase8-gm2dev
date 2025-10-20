import { ERROR_TYPES } from '../constants.js';

// Crea un objeto de error con tipo y código HTTP
export function createError(status, type, message = 'Error') {
  const err = new Error(message);
  err.status = status;
  err.type = type || ERROR_TYPES.INTERNAL; // CAMBIO: valor por defecto
  return err;
}

// Detecta tipo y status en base al mensaje de error
function inferTypeFromMessage(msg = '') {
  const m = msg.toLowerCase();

  // 400 → Falta un campo o parámetro requerido
  if (/(required|campo requerido|falta|missing)/.test(m))
    return { type: ERROR_TYPES.BAD_REQUEST, status: 400 };

  // 422 → Error de formato o validación de datos
  if (/(invalid|inválid|inválido|formato)/.test(m))
    return { type: ERROR_TYPES.UNPROCESSABLE_ENTITY, status: 422 }; // CAMBIO: tipo más correcto

  // 404 → No encontrado
  if (/(no existe|not found)/.test(m))
    return { type: ERROR_TYPES.NOT_FOUND, status: 404 };

  // 409 → Conflicto o duplicado
  if (/(ya existe|exists|duplicate|conflict)/.test(m))
    return { type: ERROR_TYPES.CONFLICT, status: 409 };

  // 500 → Error interno por defecto
  return { type: ERROR_TYPES.INTERNAL, status: 500 };
}

// Convierte cualquier error a un formato uniforme para respuestas HTTP
export function mapError(err) {
  const inferred = inferTypeFromMessage(err.message);
  return {
    status: err.status ?? err.statusCode ?? inferred.status,
    type: err.type ?? inferred.type,
    message: err.message || 'Internal Server Error'
  };
}
