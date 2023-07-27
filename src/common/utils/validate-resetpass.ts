export const validateResetPass = (password: string, replyPassword: string) => {
    if(!password || !replyPassword){
        return {
            ok: false, 
            message: "Hasło nie może być puste",
        }
    }

    if( password.length < 6 || replyPassword.length < 6){
        return {
            ok: false,
            message: "Hasło musi mieć więcej niż 6 znaków",
        }
    }

    if( password !== replyPassword){
        return {
            ok: false,
            message: "Hasła muszą być identyczne",
        }
    }

    return {
        ok: true, 
        message: "OK",
    }
}