export class Users{
    constructor(
        public id: string | undefined,
        public username: string | undefined,
        public email: string | undefined,
        public firstname: string | undefined,
        public lastname: string | undefined,
        public role: string | undefined,
        public avatar: string | undefined,
        public created: string | undefined,
        public updated: string | undefined,
    ){}
}