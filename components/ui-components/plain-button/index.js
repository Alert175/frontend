import PropTypes from 'prop-types'

import classes from './plain-button.module.scss'

const PlainButton = ({children, disabled, styleConfig, clickEvent, className}) => {
    return (
        <button
            style={{
                height: '54px',
                width: '100%',
                backgroundColor: '#0C0C0C',
                color: '#fff',
                cursor: disabled ? 'auto' : 'pointer',
                opacity: disabled ? '0.5' : '1',
                ...styleConfig
            }}
            disabled={disabled}
            onClick={clickEvent}
            className={`${classes.button} ${className}`}
        >
            {children}
        </button>
    )
}

PlainButton.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    styleConfig: PropTypes.object,
    clickEvent: PropTypes.func,
    className: PropTypes.string
}

PlainButton.defaultProps = {
    children: '',
    disabled: false,
    styleConfig: {},
    clickEvent: () => null,
    className: ''
}

export default PlainButton;