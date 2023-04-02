import { Users } from "./users";
import { Books } from "./books";

export class Reported {
    constructor(
    public id: string | undefined,
    public book_id: string | undefined,
    public user_id: string | undefined, 
    public reason: string | undefined,
    public description: string | undefined,
    public created: string | undefined,
    public updated: string | undefined,
    ){}
}