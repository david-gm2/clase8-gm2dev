export function createUser(userData) {
    const nombre = String(userData.nombre ?? '').trim();
    const email = String(userData.email ?? '').trim().toLowerCase();
    const password = userData.password;

    const user = {
        id: Date.now(),
        nombre,
        email,
        password,
        createdAt: new Date().toISOString()
    };

    return user;
}

export function getUserWithoutPassword(user) {
    if (Object.keys(user).length === 0) return null
    const { password, ...safeUser } = user
    return safeUser
}

export function getUsersWithoutPassword(users) {
        const safeUsers = users.map(({ password, ...safeUser }) => safeUser);
        return safeUsers
}
