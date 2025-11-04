import Usuario from '../models/user.models.js';

export const UserRepository = {
    list: () => Usuario.findAll({ order: [['created_at', 'DESC']] }),
    get:  (id) => Usuario.findByPk(id),
    create: (data) => Usuario.create(data),
    update: (id, data) => Usuario.update(data, { where: { id } }),
    delete: (id) => Usuario.destroy({ where: { id } }),
    findByEmail: (email) => Usuario.findOne({ where: { email }, attributes: ['id', 'email', 'role', 'password']})
};
