const usuarios = [];

export function findAll() {
    return usuarios;
}

export function findById(id) {
    return usuarios.find(u => u.id === id);
}

export function findByEmail(email) {
    return usuarios.find(u => u.email === email);
}

export function existsByEmail(email) {
    return usuarios.some(u => u.email === email);
}

export function save(userData) {
    usuarios.push(userData);
    return userData;
}

export function update(id, userData) {
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return null;

    const updated = { ...usuarios[index], ...userData };
    usuarios[index] = updated;
    return updated;
}

export function deleteById(id) {
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return null;

    const [deleted] = usuarios.splice(index, 1);
    return deleted;
}
