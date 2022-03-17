import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { selectActiveTypeFeed } from "~/store/reducers/feed";
import PlainLoader from "~/components/ui-components/plain-loader";
import SingleXmlLoader from "~/components/ui-components/single-xml-loader";
import classes from "styles/pages-styles/banks.module.scss";
import EditFeed from "~/components/pages-components/feed-components/edit-feed";
import { asyncCheckIsAuth } from "~/store/reducers/manager";
import axios from "axios";

import { addMessage } from "~/store/reducers/messages";

const FeedComponent = () => {
    const activeTypeFeed = useSelector(selectActiveTypeFeed);

    const dispatch = useDispatch();

    const [isPending, setIsPending] = useState(false);
    const [isFinalParsing, setIsFinalParsing] = useState(false);

    useEffect(() => {
        dispatch(asyncCheckIsAuth());
    }, []);

    const checkStatus = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_FILE_STORAGE_URL}/complex-layout/collect-layout/status-parse-feed`);
            if (data.statusParseFeed === "success") {
                setIsPending(false);
                clearInterval(interval);
                // setIsFinalParsing(true)
                dispatch(
                    addMessage({
                        text: "Фид успешно обработан",
                        type: "success",
                    })
                );
            }
            dispatch(
                addMessage({
                    text: "Фид обрабатывается",
                    type: "info",
                })
            );
        } catch (error) {
            console.error(error);
            clearInterval(interval);
            dispatch(
                addMessage({
                    text: "Ошибка при обработке фида",
                    type: "info",
                })
            );
        }
    };

    let interval = null;

    const intervalCheckParsingStatus = () => {
        interval = setInterval(checkStatus, 5000);
    };

    return (
        <div className={classes.pageContainer}>
            <h2>Фиды</h2>
            <EditFeed />
            {activeTypeFeed !== "" && (
                <div className={`${classes.sectionContainer} plain-row-container`} style={{ maxWidth: "650px" }}>
                    <h1 className="header">Загрузить фид на сервер</h1>
                    <div className="plain-row-container" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                        {/* <TextInput value={name} changeValue={(value) => setName(value)} /> */}
                        <SingleXmlLoader onClick={intervalCheckParsingStatus} />
                    </div>
                    {isPending && <PlainLoader className={classes.loader} />}
                </div>
            )}

            {isFinalParsing && <h3>Успешно загружен</h3>}
        </div>
    );
};

export default FeedComponent;
