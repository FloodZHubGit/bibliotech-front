export class Users{
    constructor(
        public id: string | undefined,
        public username: string | undefined,
        public email: string | undefined,
        public firstname: string,
        public lastname: string,
        public role: string | undefined,
        public avatar: string | undefined,
        public followers: string[] | undefined,
        public created: string | undefined,
        public updated: string | undefined,
    ){}
}