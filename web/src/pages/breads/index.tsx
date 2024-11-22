import styles from './breads.module.css';
import Header from '../../components/header';
import { useEffect, useState } from 'react';
import Product from '../../components/productcard';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface Bread{
    id:number;
    name: string;
    image: string;
    description: string;
    sizes: number[];
    prices: number[];
}
interface unmappedBread{
    id:number;
    name: string;
    image: string;
    description: string;
    sizes: string;
    prices: string;
}

function Breads() {
    const [breads, setBreads] = useState<Bread[]>([]);
    const isAdmin = useAuth().type == 'admin';
    const [isNew, setIsNew] = useState(false);
    const [newBread, setNewBread] = useState<Bread>({
        id: 0,
        name: '',
        image: 'produto1.jpg',
        description: '',
        sizes: [],
        prices: [],
    })
    const [images, setImages] = useState([]);

    const [newSizes, setNewSizes] = useState<number[]>([]);
    const [newPrices, setNewPrices] = useState<number[]>([]);

    useEffect(() => {
        fetchBreads()
    }, [breads])
    
    useEffect(() => {
        fetchImageNames()
    }, [images])
    
    async function fetchImageNames() {
        try{
            await api.get('/productimages').then((response) => {
                setImages(response.data);
            })
        } catch(err) {
            alert('Falha em buscar nomes de imagens!')
            console.log(err)
        }
    }
    
    async function fetchBreads() {
        try {
            await api.get('/breads').then((response) =>{
            const unmappedBreads = response.data;
            const newBreads : Bread[] = []
            unmappedBreads.map((bread : unmappedBread) => {
                const sizes = JSON.parse(bread.sizes)
                const prices = JSON.parse(bread.prices)
                newBreads.push(
                    {
                        id: bread.id,
                        name: bread.name,
                        image: bread.image,
                        description: bread.description,
                        sizes: sizes.sizes.map((size: string) => parseInt(size)),
                        prices: prices.prices.map((price: string) => parseFloat(price)),
                    }
                )
            })
            setBreads(newBreads)
        })
        } catch (err) {
            alert('Falha em buscar pães!')
            console.log(err)
        }
    }

    async function handleAdd(){
        if (newSizes.length > 0 && newPrices.length > 0) {
            try {
                await api.post('/products',{
                    name: newBread.name,
                    description: newBread.description,
                    image: newBread.image,
                    sizes: JSON.stringify({sizes: newSizes}),
                    prices: JSON.stringify({prices: newPrices}),
                    category: 'Breads',
                })
                alert('Pão cadastrado!')
                setNewBread({
                    id: 0,
                    name: '',
                    image: 'produto1.jpg',
                    description: '',
                    sizes: [],
                    prices: [],
                })
                setNewSizes([])
                setNewPrices([])
            } catch(err) {
                alert('Falha ao adicionar pão!')
                console.log(err)
            }
        } else {
            alert('Por favor, preencha todos os campos de tamanhos e preços!')
        }
    }

    return(
        <div id={styles.breads}>
            <div id={styles.banner}>
                <Header />
                <h1>Pães</h1>
            </div>
            <div id={styles.products}>
            {
                breads.map((bread: Bread) => (
                    <Product id={bread.id} name={bread.name} prices={bread.prices} image={bread.image} description={bread.description} sizes={bread.sizes} category='Breads' isAdmin={isAdmin}/>
                ))
            }
            </div>
            {isAdmin && (
                <div id={isNew ? styles.newAdding : styles.newButton} className={styles.newForm}>
                    <button onClick={()=>setIsNew(!isNew)}>{isNew ? '-' : '+'}</button>
                    <div id={styles.newForm}>
                        <div>
                            <p>Nome</p>
                            <input type="text" value={newBread?.name} onChange={(e)=>{setNewBread((bread) => ({...bread, name:e.target.value}))}}/>
                            <p>Descrição</p>
                            <input type="text" value={newBread?.description} onChange={(e)=>{setNewBread((bread) => ({...bread, description:e.target.value}))}}/>
                            <p>Imagem</p>
                            <select value={newBread?.image} onChange={(e)=>{setNewBread((bread) => ({...bread, image:e.target.value}))}}>
                                {images.map((image)=> (
                                    <option value={image}>{image}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <img src={`/products/${newBread?.image}`}/>
                        </div>
                        <div id={styles.pricesizes}>
                            <h1>Tamanhos e Preços</h1>
                            {newSizes.map((size, index) => (
                                <div>
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
                        <button onClick={handleAdd}id={styles.addbutton}>Adicionar</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Breads;