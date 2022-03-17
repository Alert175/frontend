import PropTypes from 'prop-types'

import PlainCheckbox from "~/components/ui-components/plain-checkbox";

import classes from './multiple-list.module.scss'

const MultipleList = ({elements, activeElements, selectEvent, raiseEvent, label, isDisabled, style, multipleListRef}) => {
    const handlerClickElement = (index = Number, isSelected = Boolean()) => {
        if (isDisabled) {
            return
        }
        if (isSelected) {
            raiseEvent(index)
            return
        }
        selectEvent(index)
    }

    return (
        <div
            className={classes.container}
            style={{
                opacity: isDisabled ? '0.5' : '1',
                ...style
            }}
            ref={multipleListRef}
        >
            {label && <span className={classes.label}>{label}</span>}
            <div className={classes.containerElements}>
                {
                    elements.map((element, id) =>
                        <div
                            key={`${element.index}_${id}`}
                            className={`${classes.element}`}
                            onClick={() => handlerClickElement(element.index, activeElements.includes(element.index))}
                        >
                            {String(element.text)}
                            <PlainCheckbox
                                isChecked={activeElements.includes(element.index)}
                                checkEvent={() => handlerClickElement(element.index, activeElements.includes(element.index))}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

MultipleList.propTypes = {
    elements: PropTypes.array,
    activeElements: PropTypes.array,
    selectEvent: PropTypes.func,
    raiseEvent: PropTypes.func,
    isDisabled: PropTypes.bool,
    label: PropTypes.string,
    style: PropTypes.object
}

MultipleList.defaultProps = {
    elements: [],
    activeElements: [],
    selectEvent: Function(),
    raiseEvent: Function(),
    isDisabled: false,
    label: '',
    style: {}
}

export default MultipleList;