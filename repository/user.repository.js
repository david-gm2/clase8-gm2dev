import { pool } from '../db/pool.js';

const PUBLIC_PARAMS = 'id, nombre, email, created_at';
const TABLE_NAME = 'usuarios';

export async function findAll() {
    const [rows] = await pool.execute(`SELECT ${PUBLIC_PARAMS} FROM ${TABLE_NAME}`);
    return rows;
}

export async function getUserById(id) {
    const [rows] = await pool.execute(`SELECT ${PUBLIC_PARAMS} FROM ${TABLE_NAME} WHERE id = ?`, [id]);
    return rows[0] ?? null;
}

export async function findByEmail(email) {
    const [rows] = await pool.execute(`SELECT ${PUBLIC_PARAMS} FROM ${TABLE_NAME} WHERE email = ?`, [email]);
    return rows[0] ?? null;
}

export async function existsByEmail(email) {
    const [rows] = await pool.execute(`SELECT COUNT(*) as count FROM ${TABLE_NAME} WHERE email = ?`, [email]);
    return rows[0].count > 0;
}

export async function save(userData) {

    const keys = Object.keys(userData);
    const valuesData = Object.values(userData);

    const quantity = keys.map(() => '?').join(', ');

    const [result] = await pool.execute(`INSERT INTO ${TABLE_NAME} (${keys.join(', ')}) VALUES (${quantity})`, [...valuesData]);
    return await getUserById(result.insertId);
}

export async function update(id, userData) {
    const { userId , ...dataToUpdate } = userData;
    const sets = [];
    const values = [];

    for (const key of Object.keys(dataToUpdate)) {
        if (dataToUpdate[key] !== undefined) {
            sets.push(`${key} = ?`);
            values.push(dataToUpdate[key]);
        }
    }

    await pool.execute(`UPDATE ${TABLE_NAME} SET ${sets.join(', ')} WHERE id = ?`, [...values, id]);
    return await getUserById(id);
}

export async function deleteById(id) {
    const [res] = await pool.execute(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]);
    return res;
}
