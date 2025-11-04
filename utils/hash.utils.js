import bcrypt from 'bcryptjs';

export async function hash(value, rounds = 12) {
    return bcrypt.hash(value, rounds);
}

export async function compare(value, hash) {
    return bcrypt.compare(value, hash);
}
