export default interface Review {
    reviewId: number,
    customerId: number,
    productId: number,
    text: string,
    creationTime: string,
    rating: number,
    productName: string,
    productImage: string,
    code: string,
}