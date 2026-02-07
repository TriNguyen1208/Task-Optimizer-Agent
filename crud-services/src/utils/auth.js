import bcrypt from 'bcrypt';

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function comparePasswords(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
}
export { hashPassword, comparePasswords };