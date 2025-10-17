export class UsersService {
    constructor() {
        this.users = [];
    }

    async addUser(user) {
        this.users = [...this.users, user];
    }

    async getAllUsers() {
        return this.users;
    }

    async findUserById(id) {
        return this.users.find(user => user.id === id);
    }

    async emailExists(email) {
        return this.users.some(user => user.email === email);
    }

    async updateUserById(id, userData) {
        let updatedUser = null;

        this.users = this.users.map(user => {
            if (user.id !== id) return user;

            updatedUser = {
            ...user,
            ...userData,
            id: user.id,       
            createdAt: user.createdAt,   
            };
            return updatedUser;
        });

        if (!updatedUser) throw createError(404, 'not_found', 'Usuario no encontrado');

        return updatedUser;
    }

    async deleteUserById(id) {
        this.users = this.users.filter(user => user.id !== id);
    }
}
