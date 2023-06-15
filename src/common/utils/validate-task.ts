import { CreateNewTaskDto } from "src/task/dto/create-task.dto";

export async function validateTaskData(data: CreateNewTaskDto): Promise<{ ok: boolean, message: string, title: string | null}> {
    console.log(data);
    if(!data.title || !data.brief || !data.project || !data.taskTime || !data.user){
        return {
            ok: false,
            message: "Nie podano wszystkich danych",
            title: null,
        }
    } else if(data.title.length > 100) {
        return {
            ok: false,
            message: "Nazwa zadania nie może być dłuższa niż 100 znaków",
            title: null,
        }
    } else if(data.brief.length > 256 ) {
        return {
            ok: false,
            message: "Krótki opis nie może być dłuższa niz 256 znaków",
            title: data.title,
        }
    } else if(data.taskTime < 0) {
        return {
            ok: false,
            message: "Czas zadania nie może być wartością ujemną",
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