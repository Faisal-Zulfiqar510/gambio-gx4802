import CustomerWishlistItemOption from "./CustomerWishlistItemOption";
import CustomerWishlistItemDetails from "./CustomerWishlistItemDetails";

export default interface CustomerWishlistItem {
	productId: string;
	extendedProductId: string;
	wishlistItemId: number;
	itemDetails: CustomerWishlistItemDetails;
	amount: number;
	selectedOptions: CustomerWishlistItemOption[];
	addedAt: string;
}