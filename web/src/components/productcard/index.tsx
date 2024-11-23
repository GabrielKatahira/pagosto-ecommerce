import React, { useState, useEffect } from 'react';
import styles from './productcard.module.css';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface ProductProps{
    id: number;
    name: string;
    image: string;
    description: string;
    sizes: number[];
    prices: number[];
    category: string;
    isAdmin: boolean;
}

interface User {
    id: number;
    cart: Bought[];
}
interface Bought {
    id: number;
    size: number;
    price: number;
}


const Product: React.FC<ProductProps> = ({id,name,image,description,sizes,prices,category,isAdmin}) => {
    const [size,setSize] = useState(sizes[0]);
    const [price,setPrice] = useState(prices[0]);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);
    const [newDescription, setNewDescription] = useState(description);
    const [newImage, setNewImage] = useState(image);
    const [newSizes, setNewSizes] = useState<number[]>(sizes);
    const [newPrices, setNewPrices] = useState<number[]>(prices);
    const [currUser, setCurrUser] = useState<User>({id: 0, cart: []})
    const userId = useAuth()?.id || 0
    const [images, setImages] = useState([]);

    
    useEffect(() => {
        if (isAdmin) {
            fetchImageNames()
        }
    }, [images])

    async function fetchImageNames() {
        try{
            api.get('/productimages').then((response) => {
                setImages(response.data);
            })
        } catch(err) {
            alert('Falha em buscar nomes de imagens!')
            console.log(err)
        }
    }

    useEffect(() => {
        fetchUser()
    },[currUser])

    async function fetchUser() {
        try {
            if (userId > 0) {
                await api.get('/users',{params: {id: userId}}).then(res => {
                    
                    setCurrUser({
                        id:res.data.id,
                        cart:JSON.parse(res.data.cart).cart
                    });
                })
            }
        } catch(err) {
            alert('Erro no login!');
            console.log(err)
        }
    }

    function handleSize(e:React.ChangeEvent<HTMLSelectElement>) {
        if (e.target){
            setSize(Number(e.target.value));
            setPrice(prices[sizes.indexOf(Number(e.target.value))]);
        }

    }

    async function handleDelete(){
        try{
            await api.delete('/products',{params:{id}}).then(
                response => {
                    alert('Produto deletado com sucesso!');
                }
            )
        } 
        catch(err){
            alert('Falha em deletar o produto!');
            console.log(err);
        }
    }
    function handleToggleEdit() {
        setIsEditing(!isEditing);
        setNewName(name);
        setNewDescription(description);
        setNewImage(image)
        setNewSizes(sizes);
        setNewPrices(prices);
    }
    async function handleSave() {
        try{
            await api.put('/products',{
                id,
                name: newName,
                description: newDescription,
                image: newImage,
                sizes: JSON.stringify({sizes: newSizes}),
                prices: JSON.stringify({prices: newPrices}),
                category: 'Breads'
            }).then(
                response => {
                    alert('Produto editado com sucesso!');
                    setIsEditing(false);
                }
            )
        } 
        catch(err){
            alert('Falha em editar o produto!');
            console.log(err);
        }
    }
    async function addToCart() {
        try {
            const userCart : Bought[] = currUser.cart
            const addedProduct = {id,size,price};
            userCart.push(addedProduct);
            await api.put(`/cart?id=${userId}`,{cart:JSON.stringify({cart:userCart})}).then(() =>{
                console.log('Carrinho atualizado!')
            })
        } catch(err) {
            console.error(err)
        }
    }
    return(
        <div id={styles.productcard}>
            <div id={styles.image}>
                <img src={`/products/${isEditing ? newImage : image}`} />
                {isEditing && 
                    ( <select value={newImage} onChange={(e)=>setNewImage(e.target.value)}>
                    {images.map((image)=> (
                        <option value={image}>{image}</option>
                    ))}
                </select>)
                }
            </div>
            {isEditing ? 
                (<div id={styles.titleedit}>
                    <input type="text" value={newName} onChange={(e) => {setNewName(e.target.value)}}/>
                    <input type="text" value={newDescription} onChange={(e) => {setNewDescription(e.target.value)}}/>
                </div>) : (
                <div id={styles.title}>
                    <h1>{name}</h1>
                    <p>{description}</p>
                </div>)}
            {isEditing ? (
                <div id={styles.pricesizes}>
                    {newSizes.map((size, index) => (
                        
                                <div >
                                    <input
                                        type="number"
                                        value={size}
                                        onChange={(e) => {
                                        const updatedSizes = newSizes.map((size, i) => 
                                        i === index ? parseInt(e.target.value, 10) : size
                                        );
                                        setNewSizes(updatedSizes);
                                    }}
                                    />
                                    <input
                                        type="number"
                                        value={newPrices[index]}
                                        onChange={(e) => {
                                        const updatedPrices = newPrices.map((price, i) => 
                                        i === index ? parseFloat(e.target.value) : price
                                        );
                                        setNewPrices(updatedPrices);
                                        }}
                                        step='0.01'
                                    />
                                    <button onClick={()=>{
                                        const filteredSizes = newSizes.filter((_, i) => i !== index)
                                        setNewSizes(filteredSizes)
                                        const filteredPrices = newPrices.filter((_, i) => i !== index)
                                        setNewPrices(filteredPrices)
                                    }}><i className="fa-solid fa-trash"></i></button>
                                    </div>
                                
                            ))}
                            <button onClick={()=>{
                                setNewSizes(pastSizes => [...pastSizes,0])
                                setNewPrices(pastPrices => [...pastPrices,0.00])
                            }}>+</button>
                        
                        </div>
                 ) : (
                <div id={styles.sizeprice}>
                  <div id={styles.choosesize}>
                  <p>Escolha o tamanho:</p>
                  <select value={size} onChange={(e) => {handleSize(e)}}>
                      {
                          sizes.map((size, index) => 
                              <option key={index} value={size}>{size} cm</option>
                          )
                      }
                    </select>
                    </div>
                    <div id={styles.price}>
                        <p>R$ {price.toFixed(2)}</p>
                    </div>
              </div>
            )}
            {isEditing ? (<button id={styles.btnbuy} onClick={handleSave}>Finalizar Edição</button>) 
            : (<button id={styles.btnbuy} onClick={addToCart}>Adicionar ao Carrinho</button>)
            }
            
            {isAdmin && <button id={styles.btnadm} onClick={handleToggleEdit}><i className={`fa-solid ${isEditing ? 'fa-x' : 'fa-pencil'} fa-2x`}></i></button>}
            {isAdmin && <button id={styles.btnadm} onClick={handleDelete}><i className="fa-solid fa-trash fa-2x"></i></button>} 
        </div>
    )
}

export default Product;