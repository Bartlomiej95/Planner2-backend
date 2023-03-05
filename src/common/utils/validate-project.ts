import { CreateNewProjectDto } from "src/project/dto/create-project.dto"; 

export async function validateProjectData(data: CreateNewProjectDto): Promise<{ ok: boolean, message: string, title: string | null}> {
    if(!data.title || !data.customer || !data.deadline || !data.hours || !data.value ||!data.content){
        return {
            ok: false,
            message: "Nie podano wszystkich danych",
            title: null,
        }
    } else if(data.title.length > 256) {
        return {
            ok: false,
            message: "Długość nazwy projekty nie może przekraczać 256 znaków",
            title: null,
        }
    } else if(data.customer.length > 100 ) {
        return {
            ok: false,
            message: "Nazwa klienta nie może być dłuższa niz 100 znaków",
            title: data.title,
        }
    } else if(data.hours < 0) {
        return {
            ok: false,
            message: "Czas projektu nie może być wartością ujemną",
            title: data.title,
        }
    } else if(data.value < 0) {
        return {
            ok: false,
            message: "Wartość projektu nie może być ujemny",
            title: data.title,
        }
    } else if( data.deadline < new Date()){
        return {
            ok: false,
            message: "Deadline nie może być datą z przeszłości",
            title: data.title,
        }
    } else {
        return {
            ok: true,
            message: 'Ok',
            title: data.title,
        }
    }
}