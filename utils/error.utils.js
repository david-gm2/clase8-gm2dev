export function createError(status, type, message = 'Error') {
    const err = new Error(message);
    err.status = status; 
    err.type = type || 'server';
    return err;
}

function inferTypeFromMessage(msg = '') {
    const m = msg.toLowerCase();

    if (/(required|campo requerido|falta|missing)/.test(m))
        return { type: 'bad_request', status: 400 };

    if (/(invalid|inválid|inválido)/.test(m))
        return { type: 'invalid', status: 422 };

    if (/(no existe|not found)/.test(m))
        return { type: 'not_found', status: 404 };

    if (/(ya existe|exists|duplicate|conflict)/.test(m))
        return { type: 'conflict', status: 409 };

    return { type: 'server', status: 500 };
}

export function mapError(err) {
    const inferred = inferTypeFromMessage(err.message);
    return {
        status: err.status ?? err.statusCode ?? inferred.status,
        type: err.type ?? inferred.type,
        message: err.message || 'Internal Server Error'
    };
}
