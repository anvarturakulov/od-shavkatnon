import { OrderStatus, OrderTypeTitle } from "@/app/interfaces/order.interface";

export const defineUrlTypeForOrder = (contentTitle: string) => {
    switch (contentTitle) {
        case OrderTypeTitle.OPEN:
            return OrderStatus.OPEN;
        case OrderTypeTitle.COMPLETED:
            return OrderStatus.COMPLETED;
        case OrderTypeTitle.DELETED:
            return OrderStatus.DELETED;
        case OrderTypeTitle.EXPIRED:
            return OrderStatus.EXPIRED;
        default:
            return OrderStatus.OPEN;
    }
}