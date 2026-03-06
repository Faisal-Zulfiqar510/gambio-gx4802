import CustomerCartItem from "./CustomerCartItem";

export default interface CustomerCart {
	customerId: number;
	items: CustomerCartItem[];
}