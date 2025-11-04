import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export function getPublicUser(data) {
    if (Array.isArray(data)) {
        return data.map(u => {
        const { password, ...rest } = u.dataValues ?? u;
        return rest;
        });
    }
    const { password, ...rest } = data.dataValues ?? data;
    return rest;
}

export default Usuario;
