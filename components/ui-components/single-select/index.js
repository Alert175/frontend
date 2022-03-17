import {useEffect, useState} from "react";
import PropTypes from 'prop-types'

import classes from './single-select.module.scss'

import Arrow from '~/public/Images/UIComponents/SingleSelect/arrow.svg'

const SingleSelect = ({activeValue, elements, selectEvent, holder, label, isDisabled}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className={classes.containerSelect}
            tabIndex='0'
            onBlur={() => setIsOpen(false)}
            style={{
                opacity: isDisabled ? '0.5' : '1',
                cursor: isDisabled ? 'default' : 'pointer'
            }}
        >
            {label && <div className={classes.label}>{label}</div>}
            <div
                className={classes.controlElement}
                onClick={() => setIsOpen(isDisabled ? false : !isOpen)}
            >
                {
                    activeValue !== null
                        ? <span className={classes.activeElement}>{elements[activeValue]}</span>
                        : <span className={classes.holder}>{holder}</span>
                }
                <Arrow
                    height={'10px'}
                    width={'20px'}
                    style={{
                        transition: 'transform 0.5s',
                        transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)'
                    }}
                />
            </div>
            {
                isOpen
                    ? <div className={classes.elementsContainer}>
                        {
                            elements.map((element, index) =>
                                <div key={index} className={classes.element} onClick={() => {
                                    selectEvent(index);
                                    setIsOpen(false);
                                }}>
                                    {element}
                                </div>
                            )
                        }
                    </div>
                    : null
            }
        </div>
    )
}

SingleSelect.proptypes = {
    activeValue: PropTypes.number,
    elements: PropTypes.array,
    selectEvent: PropTypes.func,
    holder: PropTypes.string,
    label: PropTypes.string,
    isDisabled: PropTypes.bool
}

SingleSelect.defaultProps = {
    activeValue: null,
    elements: [],
    selectEvent: Function(),
    holder: 'holder',
    label: 'label',
    isDisabled: false
}

export default SingleSelect;