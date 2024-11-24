import styles from './header.module.css';
import HeaderLink from '../headerlink';
import logo from '../../assets/images/logo.png'
import Login from '../login';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';


function Header() {
    const [loginVis, setLoginVis] = useState(false);
    const [cartSize, setCartSize] = useState(0);
    const userId = useAuth()?.id;
    async function getCartSize() {
        try {
            await api.get('/users', {params:{id:userId}}).then(res=> {
                setCartSize(JSON.parse(res.data.cart).cart.length);
            })
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (userId) {
            getCartSize();
            const interval = setInterval(getCartSize, 1000);
            return () => clearInterval(interval);
        }
    },[userId])
    return(
        <div id={styles.header}>
            <img src={logo}/>
            <h1>Panificadora Agosto</h1>
            <div>
                <HeaderLink title="Home" link="/" icon="fa-solid fa-house-chimney fa-2x" />
                <HeaderLink title="Produtos" link="/produtos" icon="fa-solid fa-bag-shopping fa-2x" />
                <div id={styles.logincontainer}>
                    <button id={styles.loginbutton} onClick={()=>{setLoginVis(!loginVis)}}>
                        <i className={`fa-solid ${useAuth().id ? 'fa-id-badge' : 'fa-right-to-bracket'} fa-2x`}></i>
                        <h1>{useAuth().id ? 'Perfil' : 'Login'}</h1>
                    </button>
                    <Login isVisible={loginVis} toggleVis={() =>{setLoginVis(!loginVis)}}/>
                </div>
                {useAuth().id ? (<HeaderLink title={`Carrinho (${cartSize})`} link="/carrinho" icon="fa-solid fa-shopping-cart fa-2x" />) : 
                ( <HeaderLink title="Cadastro" link="/cadastro" icon="fa-solid fa-user fa-2x" />)
                }
               
                
            </div>
        </div>
    )
}
export default Header;