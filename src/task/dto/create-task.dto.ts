export class CreateNewTaskDto {
    title: string;
    brief: string;
    guidelines: string | null;
    taskTime: number;
    project: string;
    user: string;
}