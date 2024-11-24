import styles from './ordercard.module.css'
import api from '../../services/api';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Product } from '../../pages/orders';

interface OrderCardProps {
    order_id: number;
    customerName: string;
    totalPrice: number;
    orderDate: Date;
    items:Product[];
    status: string;
    reload(): void;
}


const OrderCard: React.FC<OrderCardProps> = ({ order_id, customerName, totalPrice, orderDate, items, status, reload }) => {
    const isAdmin = useAuth().type == 'admin'
    const [newStatus, setNewStatus] = useState(status);

    async function updateStatus(e:React.ChangeEvent<HTMLSelectElement>) {
        const updatedStatus = e.target.value
        setNewStatus(updatedStatus);
        try {
            await api.put('/orders', {orderId: order_id, status: updatedStatus}).then(() => {
                reload();
            });
        } catch (error) {
            console.error(error);
        }
    }
    return(
        <div id={styles.ordercard}>
            <h1>Pedido #{order_id.toString().padStart(5,'0')}</h1>
            <img src={'products/'+items[0].image} id={styles.orderimage}/>
            { isAdmin && (<h2>Feito por: {customerName}</h2>)}
            <div id={styles.items}>
                {
                    items.map((item) => {
                        return (
                            <div>
                                <h3>-{item.name}  {item.size}cm  R${item.price.toFixed(2)}</h3>
                            </div>
                        )
                    })
                }
            </div>
            <div id={styles.price}>
                <h2>Total: R${totalPrice.toFixed(2)}</h2>
            </div>
            <div id={styles.date}>
                <h2>Data: {orderDate.toLocaleString()}</h2>
            </div>
            <div id={styles.status} className={status == 'Pendente'
                    ? styles.pending
                    : status == 'Saiu para entrega' 
                    ? styles.shipped
                    : status == 'Entregue' 
                    ? styles.delivered
                    : styles.cancelled
            }>
                <h2>Status: {status}</h2>
            </div>
            {isAdmin && (<select value={newStatus} onChange={(e)=>updateStatus(e)} id={styles.statusselect}>
                <option value="Pendente">Pendente</option>
                <option value="Saiu para entrega">Saiu para entrega</option>
                <option value="Entregue">Entregue</option>
                <option value="Cancelado">Cancelado</option>
            </select>)}
        </div>
    )
}

export default OrderCard;