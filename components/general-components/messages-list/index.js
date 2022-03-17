import {useEffect, useState} from "react";
import {useSelector} from "react-redux";

import {selectMessages} from "~/store/reducers/messages";

import classes from './messages-list.module.scss';

import Message from "~/components/general-components/messages-list/message";

const MessagesList = () => {
    const [headerHeight, setHeaderHeight] = useState(0)

    const messages = useSelector(selectMessages)
    const getHeaderHeight = () => {
        try {
            const mainHeader = document.querySelector('#main-header');
            if (!mainHeader) {
                return;
            }
            const headerHeight = mainHeader.clientHeight
            setHeaderHeight(Number(headerHeight))
        } catch(e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getHeaderHeight()
    }, [])
    return (
        <div
            className={classes.containerMessagesList}
            style={{
                top: `${headerHeight + 20}px`
            }}
        >
            {
                messages.map((element) =>
                    <Message
                        key={element.uuid}
                        id={element.uuid}
                        text={element.text}
                        type={element.type}
                        lifetime={element.lifetime}
                    />
                )
            }
        </div>
    )
}

export default MessagesList;