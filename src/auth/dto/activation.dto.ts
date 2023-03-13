import { Position } from "src/types/user.type";

export class ActivationDto {
    urlCode: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    ifUserHasCompany: boolean;
    company: string;
    nip: number | null;
    position: Position;
}