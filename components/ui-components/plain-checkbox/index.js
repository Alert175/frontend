import PropTypes from 'prop-types'

import classes from './plain-checkbox.module.scss'

import JackdawImage from 'public/Images/UIComponents/PlainCheckbox/jackdaw.svg'

const PlainCheckbox = ({isChecked, isDisabled, label, className, checkboxClassName, checkEvent}) => {
    return(
        <div className={`${classes.checkboxContainer} ${className}`} style={{opacity: isDisabled ? '0.5' : '1'}}>
            {label && <span className={classes.label}>{label}</span>}
            <label
                className={`${classes.labelCheckbox} ${checkboxClassName}`}
                style={{
                    cursor: isDisabled ? 'default' : 'pointer',
                    backgroundColor: isChecked ? '#0C0C0C' : 'transparent'
                }}
            >
                {isChecked && <JackdawImage/>}
                <input type="checkbox" className={classes.hideInput} disabled={isDisabled} onInput={checkEvent}/>
            </label>
        </div>
    )
}

PlainCheckbox.propTypes = {
    isChecked: PropTypes.bool,
    isDisabled: PropTypes.bool,
    label: PropTypes.string,
    className: PropTypes.string,
    checkboxClassName: PropTypes.string,
    checkEvent: PropTypes.func
}

PlainCheckbox.defaultProps = {
    isChecked: false,
    isDisabled: false,
    label: '',
    className: '',
    checkboxClassName: '',
    checkEvent: Function()
}

export default PlainCheckbox;