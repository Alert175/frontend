import PropTypes from 'prop-types'

import PenBlack from '~/public/Images/UIComponents/SingleList/pen.svg'
import PenWhite from '~/public/Images/UIComponents/SingleList/penWhite.svg'
import ExitBlack from '~/public/Images/UIComponents/SingleList/exit.svg'
import ExitWhite from '~/public/Images/UIComponents/SingleList/exitWhite.svg'

import classes from './plain-list.module.scss'

const PlainList = ({elements, activeElement, selectEvent, editEvent, deleteEvent, isDeleted, isEdited, label, isDisabled, style}) => {
    const handlerEditEvent = (event, index = null) => {
        event.stopPropagation()
        if (isDisabled) {
            return
        }
        editEvent(index)
    }

    const handlerDeleteEvent = (event, id = null) => {
        event.stopPropagation()
        if (isDisabled) {
            return
        }
        deleteEvent(id)
    }

    return(
        <div className={classes.container} style={{
            opacity: isDisabled ? '0.5' : '1',
            ...style
        }}>
            {label && <span className={classes.label}>{label}</span>}
            <div className={classes.containerElements}>
                {
                    elements.map((element, index) =>
                        <div
                            key={index}
                            className={`${classes.element} ${index === activeElement ? classes.elementActive : ''}`}
                            onClick={() => !isDisabled && selectEvent(index === activeElement ? null : index)}
                        >
                            {String(element)}
                            {isEdited && <PenBlack onClick={(event) => handlerEditEvent(event, index)}/>}
                            {isDeleted && <ExitBlack onClick={(event) => handlerDeleteEvent(event, index)}/>}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

PlainList.propTypes = {
    elements: PropTypes.array,
    activeElement: PropTypes.number,
    selectEvent: PropTypes.func,
    returnValue: PropTypes.string,
    editEvent: PropTypes.func,
    deleteEvent: PropTypes.func,
    isDeleted: PropTypes.bool,
    isEdited: PropTypes.bool,
    isDisabled: PropTypes.bool,
    label: PropTypes.string,
    style: PropTypes.object
}

PlainList.defaultProps = {
    elements: [],
    activeElement: null,
    returnValue: '',
    selectEvent: Function(),
    editEvent: Function(),
    deleteEvent: Function(),
    isDeleted: false,
    isEdited: false,
    isDisabled: false,
    label: '',
    style: {}
}

export default PlainList;