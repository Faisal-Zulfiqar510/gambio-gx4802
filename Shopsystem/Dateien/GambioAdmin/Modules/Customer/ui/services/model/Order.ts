export default interface Order {
    orderId: number,
    customerId: number,
    productIds: number[],
    orderDate: string,
    shippingCountry: string,
    paymentMethod: string,
    orderStatus: any,
    totalAmount: number,
}