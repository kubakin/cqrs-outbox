export declare class Message {
    id: string;
    number: number;
    name: string;
    data: any;
    createdAt: Date;
    published: boolean;
    publishedAt?: Date;
    constructor(id: string, name: string, data: any, createdAt: Date);
    publish(): void;
}
