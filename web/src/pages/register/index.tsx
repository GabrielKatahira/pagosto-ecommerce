import styles from './register.module.css'
import Header from '../../components/header'
import { useState } from 'react';
import api from '../../services/api';

interface User {
    name:string;
    password:string;
    userType:string;
}

function Register() {
    const [newUser, setNewUser] = useState<User>({
        name: '',
        password: '',
        userType: 'admin'
    })
    const [firstPass, setFirstPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    async function handleRegister() {
        if (firstPass === confirmPass) {
            newUser.password = firstPass;
            try{
                await api.post('/users', {name: newUser.name, password: newUser.password, userType: newUser.userType}).then(()=>{
                    alert('Usuário registrado com sucesso!')
                    setNewUser({name: '', password: '', userType: 'admin'})
                    setFirstPass('')
                    setConfirmPass('')}
                )
            }catch(err){
                alert('Falha ao registrar o usuário!')
                console.log(err)
            }
        } else {
            alert('Senhas não conferem!')
        }
    }

    return(
        <div id={styles.register}>
             <div id={styles.banner}>
                <Header />
                <h1>Cadastro</h1>
            </div>
            <div id={styles.cadastroform}>
                <label>Nome</label>
                <input type='text' value={newUser?.name} onChange={(e)=>{setNewUser((user) => ({...user, name:e.target.value}))}}/>
                <label>Senha</label>
                <input type='password' value={firstPass} onChange={(e)=>{setFirstPass(e.target.value)}}/>
                <label>Confirmar Senha</label>
                <input type='password' value={confirmPass} onChange={(e)=>{setConfirmPass(e.target.value)}}/>
                <label>Tipo de Usuário</label>
                <select value={newUser?.userType} onChange={(e)=>{setNewUser((user) => ({...user, userType:e.target.value}))}}>
                    <option value='admin'>Administrador</option>
                    <option value='user'>Usuário</option>
                </select>
                <button onClick={handleRegister}>Registrar</button>
            </div>
        </div>
    )

}
export default Register