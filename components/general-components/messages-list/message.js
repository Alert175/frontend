import PropTypes from 'prop-types'
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";

import {deleteMessage} from "~/store/reducers/messages";

import classes from './message.module.scss'

const Message = ({id, type, text, lifetime}) => {
    const [isVisible, setIsVisible] = useState(false)

    const dispatch = useDispatch()

    const hideMessage = () => setTimeout(() => {
        setIsVisible(false)
    }, Number(lifetime) * 1000);

    const handlerDeleteMessage = () => setTimeout(() => {
        dispatch(deleteMessage(id))
    }, (Number(lifetime + 0.5)) * 1000)

    useEffect(() => {
        setIsVisible(true)
        hideMessage()
        handlerDeleteMessage()
        return clearTimeout(handlerDeleteMessage())
    }, [])

    const colorLine = () => {
        if (type === 'error') {
            return 'red'
        }
        if (type === 'success') {
            return 'green'
        }
        if (type === 'info') {
            return 'blue'
        }
        return 'gray'
    }

    return(
        <div className={`${classes.messageContainer} ${isVisible ? classes.visible : ''}`}>
            <div
                className={classes.line}
                style={{
                    backgroundColor: colorLine()
                }}
            />
            <span className="plain-text">{text}</span>
        </div>
    )
}

Message.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    text: PropTypes.string,
    lifetime: PropTypes.number
}

Message.defaultProps = {
    id: '',
    type: '',
    text: '',
    lifetime: 0
}

export default Message;