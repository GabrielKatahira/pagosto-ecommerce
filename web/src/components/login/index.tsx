import { useState } from 'react';
import styles from './login.module.css'
import api from '../../services/api';
import {setToken, decodeToken, removeToken} from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';


interface User {
    name: string;
    password: string;
}
interface LoginWindow {
    isVisible: boolean;
    toggleVis(): void;
}

const Login:React.FC<LoginWindow> = ({isVisible, toggleVis}) => {
    const [user, setUser] = useState<User>({
        name: '',
        password: ''
    })
    const isLoggedIn = useAuth().id ? true : false
    async function handleLogin() {
        try {
            await api.get('/login', {params:{name:user.name, password:user.password}}).then((res) =>{
                setToken(res.data.token);
                toggleVis();
                setUser({name: '', password: ''});
                alert('Login efetuado com sucesso!')
                }
            )
        } catch (err) {
            alert('Falha ao fazer login!')
            console.log(err)
        }
    }
    return(
        <div id={styles.loginwindow} className={isVisible ? styles.show : styles.hide}>
            {isLoggedIn ? 
            (<div>
                <div>Bem vindo(a), <b>{decodeToken()?.name}</b></div>
                <button onClick={() => {removeToken();toggleVis()}}>Sair</button>
            </div>) : 
            (<>
            <div>Nome</div>
            <input type="text" value={user.name} onChange={(e) => {setUser((user)=>({...user, name:e.target.value}))}}/>
            <div>Senha</div>
            <input type="password" value={user.password} onChange={(e) => {setUser((user)=>({...user, password:e.target.value}))}}/>
            <button onClick={handleLogin}>Entrar</button>
            </>) 
            }
            
        </div>
    )
}

export default Login;