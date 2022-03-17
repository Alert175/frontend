import PropTypes from 'prop-types';

import classes from './show-image.module.scss'

const ShowImage = ({path, label, containerStyles, imageStyles, className}) => {
    return (
        <div className={'row start-content'}>
            {label && <span className={'plain-text'}>{label}</span>}
            {/* eslint-disable-next-line */}
            <a href={path} className={`${classes.container} ${className} row`} target={'_blank'} style={containerStyles}>
                {/* eslint-disable-next-line */}
                <img src={path} alt={'Не удалось загрузить картинку'} className={`${classes.image} ${className}`}
                     style={imageStyles}/>
            </a>
        </div>
    )
}

ShowImage.propTypes = {
    path: PropTypes.string,
    label: PropTypes.string,
    containerStyles: PropTypes.object,
    imageStyles: PropTypes.object,
    className: PropTypes.string,
}

ShowImage.defaultProps = {
    path: '',
    label: '',
    containerStyles: {},
    imageStyles: {},
    className: ''
}

export default ShowImage;