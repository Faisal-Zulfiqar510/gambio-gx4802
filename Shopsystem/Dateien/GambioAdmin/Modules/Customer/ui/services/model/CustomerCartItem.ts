import CustomerCartItemOption from "./CustomerCartItemOption";
import CustomerCartItemDetails from "./CustomerCartItemDetails";

export default interface CustomerCartItem {
	productId: string;
	extendedProductId: string;
	shoppingCartItemId: number;
	itemDetails: CustomerCartItemDetails;
	amount: number;
	selectedOptions: CustomerCartItemOption[];
	addedAt: string;
}