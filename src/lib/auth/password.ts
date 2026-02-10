import bcrypt from "bcrypt";

export const hashPassword = (password: string): string => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

export const validatePassword = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash);
}