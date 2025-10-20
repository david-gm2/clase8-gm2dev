export const ERROR_TYPES = {
    // 400 → El cliente envió datos incorrectos o mal formados.
    BAD_REQUEST: 'bad_request',

    // 401 → Falta autenticación o el token es inválido.
    UNAUTHORIZED: 'unauthorized',

    // 403 → El usuario está autenticado pero no tiene permiso.
    FORBIDDEN: 'forbidden',

    // 404 → El recurso solicitado no existe.
    NOT_FOUND: 'not_found',

    // 409 → Conflicto con el estado actual del recurso (ej. email duplicado).
    CONFLICT: 'conflict',

    // 422 → Los datos son válidos sintácticamente, pero no se pueden procesar (ej. validación fallida).
    UNPROCESSABLE_ENTITY: 'unprocessable_entity',

    // 422 (alternativo) → Error específico de validación de campos.
    VALIDATION: 'validation',

    // 422 (alternativo) → Datos no cumplen con el formato esperado (nombre, email, etc.).
    INVALID: 'invalid',

    // 500 → Error interno del servidor.
    INTERNAL: 'internal_error'
};
