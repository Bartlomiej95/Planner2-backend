export class UpdateTaskDto {
    title: string;
    brief: string;
    category: string;
    guidelines: string | null;
    taskTime: number;
    project: string;
    user: string;
    halfTimeReport: boolean;
    currentTime: number;
}