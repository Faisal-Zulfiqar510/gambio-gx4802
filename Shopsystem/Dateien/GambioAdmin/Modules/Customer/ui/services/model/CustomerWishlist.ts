import CustomerWishlistItem from "./CustomerWishlistItem";

export default interface CustomerWishlist {
	customerId: number;
	items: CustomerWishlistItem[];
}