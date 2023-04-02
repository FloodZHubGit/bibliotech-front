import { Users } from "./users";

export class Books{
    constructor(
        public id: string | undefined,
        public title: string,
        public resume: string | undefined,
        public image: string | undefined,
        public user_id: string | undefined,
        public user: Users | undefined,
        public category_id: string[] | undefined,
        public liked_by: string[],
        public created: string,
        public updated: string,
    ){}
}