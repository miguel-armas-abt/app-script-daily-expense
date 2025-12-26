export class EmailWrapper {
    constructor(
        public gmailMessageId: string,
        public date: string,
        public from: string,
        public subject: string,
        public bodyHtml: string
    ) { }
}