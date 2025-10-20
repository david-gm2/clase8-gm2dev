export function createUser(userData) {
    return {
        id: Date.now(),
        nombre: userData.nombre,
        email: userData.email,
        password: userData.password,
        createdAt: new Date().toISOString()
    };
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
