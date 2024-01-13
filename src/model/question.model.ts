export class Question {
    id: string;
    flag: string;
    options: Array<string>;
    answer: string;
    constructor(id: string, flag: string, options: Array<string>, answer: string) {
        this.id = id;
        this.flag = flag;
        this.options = options;
        this.answer = answer
    }
}
