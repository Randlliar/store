import {OrderStatusType} from "../../../types/order-status.type";

export class OrderStatusUtil {
  static getStatusAndColor(status: OrderStatusType | undefined | null): { name: string, color: string } {

    let name = 'Новый';
    let color = 'rgb(69, 111, 73)';

    switch (status) {
      case OrderStatusType.delivery:
        name = 'Доставка';
        break;
      case OrderStatusType.cancelled:
        name = 'Отменен';
        color = 'rgb(255, 117, 117)';
        break;
      case OrderStatusType.pending:
        name = 'Обработка';
        color = 'rgb(255,237,117)';
        break;
      case OrderStatusType.success:
        name = 'Выполнен';
        color = 'rgb(182, 213, 185)';
        break;
    }
    return {name, color};
  }
}
