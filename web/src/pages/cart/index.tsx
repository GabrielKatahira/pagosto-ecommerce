import styles from './cart.module.css'
import { useAuth } from '../../hooks/useAuth'
import Header from '../../components/header'
import api from '../../services/api'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface CartObject {
    id: number;
    price: number;
    size: number;
}
interface Product {
    id: number;
    name: string;
    image: string;
    description: string;
    size: number;
    price: number;
}


function Cart() {
    const userId = useAuth()?.id;
    const [cart, setCart] = useState<CartObject[]>([]);
    const [productList, setProductList] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    async function fetchCart() {
        try {
            if (!userId) return;

            const res = await api.get('/users', { params: { id: userId } });
            const newCart = JSON.parse(res.data.cart);

            setCart(newCart.cart); 
        } catch (err) {
            console.error('Falha ao buscar carrinho:', err);
            alert('Falha ao buscar carrinho!');
        }
    }

    async function fetchProductsForCart(cartItems: CartObject[]) {
        try {
            const products = await Promise.all(
                cartItems.map(async (cartItem, index) => {
                    const product = await fetchProductById(cartItem.id);
                    return product
                        ? {
                            id: product.id,
                            name: product.name,
                            image: product.image,
                            description: product.description,
                            size: cartItem.size,
                            price: cartItem.price,
                          }
                        : null;
                })
            );

   
            setProductList(products.filter((p) => p !== null) as Product[]);
        } catch (err) {
            console.error('Falha ao buscar produtos:', err);
        } finally {
            setLoading(false); 
        }
    }
    async function removeProduct(pindex:number) {
        try {
            const updatedCart = cart.filter((cart,index) => index != pindex)
            console.log(pindex, cart, productList)
            setCart(updatedCart);
            console.log(updatedCart)
            await api.put(`/cart?id=${userId}`,{cart: JSON.stringify({cart:updatedCart})}).then (() =>{
                console.log('Produto removido!')
            })
        } 
        catch (err) {
            console.error('Falha ao remover produto:', err);
            alert('Falha ao remover produto!');
        }
    }

    async function fetchProductById(productId: number): Promise<Product | null> {
        try {
            const res = await api.get('/products', { params: { id: productId } });
            return {
                id: res.data.id,
                name: res.data.name,
                image: res.data.image,
                description: res.data.description,
                size: 0,
                price: 0,
            };
        } catch (err) {
            console.error('Falha ao buscar produto:', err);
            alert('Falha ao buscar produto!');
            return null;
        }
    }

  
    useEffect(() => {
        async function initialize() {
            setLoading(true);
            await fetchCart(); 
        }
        initialize();
    }, [userId]); 

   
    useEffect(() => {
        if (cart.length > 0) {
            fetchProductsForCart(cart);
        } else {
            setProductList([]); 
            setLoading(false);
        }
    }, [cart]);

    return(
        <div id={styles.cart}>
            <div id={styles.banner}>
                <Header />
                <h1>Carrinho</h1>
            </div>
            <div id={styles.products}>
                {productList.map((product,index) =>(<div>
                    <img src={`/products/${product.image}`} />
                    <h1>{product.name}</h1>
                    <h3>Tamanho: {product.size} cm</h3>
                    <h2>R$ {product.price.toFixed(2)}</h2>
                    <button onClick={() => {removeProduct(index)}}>Remover</button>
                </div>))}
            </div>
            <div id={styles.total}>
                <h1>Total:</h1>
                <h2>R$ {cart.reduce((total, cartItem) => total + cartItem.price, 0).toFixed(2)}</h2>
                <button>Finalizar Compra</button>
            </div>
        </div>
    )
}
export default Cart;