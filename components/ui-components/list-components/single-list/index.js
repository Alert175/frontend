import PropTypes from 'prop-types'

import PenBlack from '~/public/Images/UIComponents/SingleList/pen.svg'
import PenWhite from '~/public/Images/UIComponents/SingleList/penWhite.svg'
import ExitBlack from '~/public/Images/UIComponents/SingleList/exit.svg'
import ExitWhite from '~/public/Images/UIComponents/SingleList/exitWhite.svg'

import classes from './single-list.module.scss'

const SingleList = ({elements, activeElement, selectEvent, editEvent, deleteEvent, isDeleted, isEdited, label, isDisabled}) => {
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

    const onSelectItem = (index) => {
        const selectIndex = index !== activeElement && index

        if (!isDisabled) {
            selectEvent(selectIndex)
        }
    }

    return(
        <div className={classes.container} style={{
            opacity: isDisabled ? '0.5' : '1'
        }}>
            {label && <span className={classes.label}>{label}</span>}
            <div className={classes.containerElements}>
                {
                    elements.map(({text, index}) =>
                        <div
                            key={`${index}_${text}`}
                            className={`${classes.element} ${index === activeElement ? classes.elementActive : ''}`}
                            onClick={() => onSelectItem(index)}
                        >
                            {text}
                            {isEdited && <PenBlack onClick={(event) => handlerEditEvent(event, index)}/>}
                            {isDeleted && <ExitBlack onClick={(event) => handlerDeleteEvent(event, index)}/>}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

SingleList.propTypes = {
    elements: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string,
        index: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })),
    activeElement: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    selectEvent: PropTypes.func,
    returnValue: PropTypes.string,
    editEvent: PropTypes.func,
    deleteEvent: PropTypes.func,
    isDeleted: PropTypes.bool,
    isEdited: PropTypes.bool,
    isDisabled: PropTypes.bool,
    label: PropTypes.string
}

SingleList.defaultProps = {
    elements: [],
    activeElement: null,
    returnValue: '',
    selectEvent: Function(),
    editEvent: Function(),
    deleteEvent: Function(),
    isDeleted: false,
    isEdited: false,
    isDisabled: false,
    label: ''
}

export default SingleList;