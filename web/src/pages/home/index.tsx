import styles from './home.module.css';
import Header from '../../components/header';
import { Link } from 'react-router-dom';
import descimg from '../../assets/images/desc.jpg'

function Home() {

    return (
        <div className={styles.home}>
            <div id={styles.hero}>
                <Header />
                <div id={styles.herotext}>
                    <h1>Amor em Cada Mordida</h1>
                    <h2>Nossos pães são feitos com muito carinho, desde o trigo até a sua mesa.</h2>
                    <Link to="/produtos">PRODUTOS</Link>
                </div>
            </div>
            <div id={styles.desc}>
                <h1>50 Anos de Experiência</h1>
                <div>
                    <p>Desde 1967, nós levamos os melhores da fornada diretamente para a sua casa. Uma receita passada entre gerações, e aperfeiçoada por cada mão que a usou.</p>
                    <img src={descimg} />
                </div>
             </div>
            
        </div>
    );
}
export default Home;