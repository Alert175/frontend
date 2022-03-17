import PropTypes from 'prop-types';

import classes from './text-input.module.scss';

const TextInput = ({label, holder, isDisabled, style, value, changeValue, type}) => {
    return (
        <div className={`${classes.inputContainer} row`} style={{
            opacity: !isDisabled ? '1' : '0.5'
        }}>
            {
                label ? <span className={classes.label}>{label}</span> : null
            }
            <input
                type={type}
                style={{
                    height: '57px',
                    width: '100%',
                    ...style
                }}
                disabled={isDisabled}
                placeholder={holder}
                value={value}
                onInput={(event) => changeValue(event.target.value)}
                className={classes.input}
            />
        </div>
    )
}

TextInput.propTypes = {
    label: PropTypes.string,
    holder: PropTypes.string,
    isDisabled: PropTypes.bool,
    style: PropTypes.object,
    value: PropTypes.string,
    changeValue: PropTypes.func,
    type: PropTypes.string
}

TextInput.defaultProps = {
    label: '',
    holder: '',
    isDisabled: false,
    style: {},
    value: '',
    changeValue: () => null,
    type: 'text'
}

export default TextInput