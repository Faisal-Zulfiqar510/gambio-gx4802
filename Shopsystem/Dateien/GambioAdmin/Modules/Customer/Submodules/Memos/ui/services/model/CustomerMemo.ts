import CustomerMemoId from "./CustomerMemoId";

export default interface CustomerMemo {
    id: CustomerMemoId;
    customerId: number;
    content: string;
}