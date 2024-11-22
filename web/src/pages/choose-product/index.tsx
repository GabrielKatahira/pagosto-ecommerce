import styles from './choose-product.module.css';
import { Link } from 'react-router-dom';
import Header from '../../components/header';

function ChooseProduct(){

    return(
        <div id={styles.chooseproduct}>
            <div id={styles.productheader}>
                <Header />
            </div>
            <div id={styles.split}>
                <Link to="/produtos/paes" id={styles.paes}>
                    <div>
                        <h1>Pães</h1>
                        <p>Entregues ainda com o calor do forno!</p>
                        <div>Veja</div>
                    </div>
                </Link>
                <Link to="/produtos/sanduiches" id={styles.sanduiches}>
                    <div>
                        <h1>Sanduíches</h1>
                        <p>Feitos com os melhores ingredientes!</p>
                        <div>Veja</div>
                    </div>
                </Link>
            </div>
        </div>
    )
}
export default ChooseProduct;