import styles from './headerlink.module.css'
import {Link} from 'react-router-dom'

interface LinkProps {
    title:string,
    icon:string,
    link:string,

}

const HeaderLink: React.FC<LinkProps> = ({link,title,icon}) =>{

    return(
        <Link to={link} id={styles.link}>
            <i className={icon}></i>
            <h1>{title}</h1>
        </Link>
    )
}
export default HeaderLink