import classes from './footer.module.scss'

const Footer = () => {
    return (
        <div className={classes.contentContainer}>
            <div className={classes.line}/>
            <span className={`plain-text ${classes.text}`}>2021 © COMPANY Все права защищены</span>
        </div>
    )
}

export default Footer;