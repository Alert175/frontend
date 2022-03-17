import PropTypes from 'prop-types';

import classes from './number-input.module.scss';

const NumberInput = ({label, holder, style, value, changeValue, isDisabled}) => {
    const validatorValue = (value) => {
        try {
            if (!isNaN(Number(value))) {
                changeValue(Number(value))
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className={`${classes.inputContainer} row`} style={{ opacity: isDisabled ? 0.5 : 1 }}>
            {
                label ? <span className={classes.label}>{label}</span> : null
            }
            <input
                type="number"
                style={{
                    height: '57px',
                    width: '100%',
                    ...style
                }}
                placeholder={holder}
                value={value}
                onInput={(event) => validatorValue(event.target.value)}
                disabled={isDisabled}
                className={classes.input}
                onWheel={blur()}
            />
        </div>
    )
}

NumberInput.propTypes = {
    label: PropTypes.string,
    holder: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.number,
    changeValue: PropTypes.func
}

NumberInput.defaultProps = {
    label: '',
    holder: '',
    style: {},
    value: null,
    changeValue: () => null
}

export default NumberInput