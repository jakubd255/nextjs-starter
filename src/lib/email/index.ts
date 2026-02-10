export const sendVerificationToken = async (email: string, token: string) => {
    console.log(`[EMAIL][VERIFY] ${email} -> ${token}`);
}

export const sendResetPasswordToken = async (email: string, token: string) => {
    console.log(`[EMAIL][RESET] ${email} -> ${token}`);
}