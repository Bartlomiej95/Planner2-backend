import { Position } from "src/types/user.type";

export class ActivationDto {
    urlCode: string;
    password: string;
    firstName: string;
    lastName: string;
    position: Position;
}