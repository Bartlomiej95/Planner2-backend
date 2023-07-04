export const validateChangePassword = (pass: string, newPass: string, replyPass: string): { ok: boolean, message: string } => {
    if(!pass || !newPass || !replyPass){
        return {
            ok: false, 
            message: "Wszystkie pola muszą być uzupełnione",
         }
    } else if( newPass.length < 6 || replyPass.length < 6) {
        return {
            ok: false, 
            message: "Hasło musi być dłuższe niż 6 znaków",
        }
    } else {
        return {
            ok: true,
            message: "Ok",
        }
    }
}