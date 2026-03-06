import Customer from "./Customer";

export default interface Memo {
    id: number,
    creatorId: number,
    creator: Customer,
    content: string,
    creationTime: string,
    updatedAtTime: string,
}