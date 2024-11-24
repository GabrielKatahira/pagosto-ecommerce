import styles from './orders.module.css'
import Header from '../../components/header'
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useState,useEffect } from 'react';
import OrderCard from '../../components/ordercard';

interface Order {
    id: number;
    userid: number;
    username: string;
    price: number;
    status: string;
    items: Product[];
    orderdate:Date;
}
export interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    size: number;
}

function Orders() {
    const userId = useAuth()?.id;
      const isAdmin = useAuth().type == 'admin'
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [userId,reload]);

    async function fetchOrders() {
        if (!userId) return;

        setLoading(true);
        try {
            const res = await api.get('/orders');
            const unmappedOrders = res.data;
            const newOrders: Order[] = [];

            for (const order of unmappedOrders) {
                const items: Product[] = JSON.parse(order.cart).cart;

                if (items) {
                    const products = await Promise.all(
                        items.map(async (item: Product) => {
                            const product = await fetchProductById(item.id);
                            return product
                                ? {
                                      id: product.id,
                                      name: product.name,
                                      image: product.image,
                                      size: item.size,
                                      price: item.price,
                                  }
                                : {
                                      id: 0,
                                      name: '',
                                      image: '',
                                      size: 0,
                                      price: 0,
                                  };
                        })
                    );
                    const newUsername = await fetchUsernameById(order.user_id)
                    newOrders.push({
                        id: order.id,
                        userid: order.user_id,
                        price: order.price,
                        status: order.status,
                        items: products,
                        orderdate: order.created_at,
                        username: newUsername,
                    });
                }
            }

            setOrders(newOrders);
        } catch (err) {
            console.error('Erro:', err);
            alert('Falha nos pedidos!');
        } finally {
            setLoading(false);
        }
    }

    async function fetchProductById(productId: number): Promise<Product> {
        try {
            const res = await api.get('/products', { params: { id: productId } });
            return {
                id: res.data.id,
                name: res.data.name,
                image: res.data.image,
                size: 0,
                price: 0,
            };
        } catch (err) {
            console.error('Erro:', err);
            alert('Falha no produto!');
            return { id: 0, name: '', image: '', size: 0, price: 0 };
        }
    }

    async function fetchUsernameById(id: number): Promise<string>{
        try {
            const res = await api.get('/users', { params: { id: id} });
            return res.data.name;
        } catch (err) {
            console.error('Erro:', err);
            return '';
        }
    }

    return ( 
        <div id={styles.orders}>
            <div id={styles.banner}>
                <Header />
                <h1>Controle de Pedidos</h1>
            </div>
            { isAdmin ?
            (<div id={styles.orderlist}>
                {loading ? (
                    <p>Carregando Pedidos...</p>
                ) : (
                    orders.map((order, index) => (
                        <OrderCard
                            key={index}
                            order_id={order.id}
                            customerName={order.username}
                            totalPrice={order.price}
                            items={order.items}
                            status={order.status}
                            orderDate={order.orderdate}
                            reload={() => setReload(!reload)}
                        />
                    ))
                )}
            </div>) : (<div>
                Me desculpe, mas você não tem permissão para ver esta página.
            </div>)}
        </div>
    );
}

export default Orders;
