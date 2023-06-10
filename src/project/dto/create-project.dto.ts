export class CreateNewProjectDto {
    title: string;
    customer: string;
    deadline: Date;
    hours: number;
    value: number;
    content: string;
    assumptions: string | null;
    users: string[] | [];
    tasks: string[] | [];
    departments: string[] | [];
}

export class UpdateProjectDto extends CreateNewProjectDto {
    id: string;
}