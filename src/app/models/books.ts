export class books{
    constructor(
        public id: string | undefined,
        public title: string | undefined,
        public resume: string | undefined,
        public image: string | undefined,
        public user_id: string | undefined,
        public category_id: string | undefined,
        public created: string | undefined,
        public updated: string | undefined,
    ){}
}