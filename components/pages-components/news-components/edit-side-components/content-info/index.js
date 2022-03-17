import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";

import {selectToken} from "~/store/reducers/manager";
import {selectActiveNews, setActiveNewsData} from "~/store/reducers/news";
import {addMessage} from "~/store/reducers/messages";

import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import TextEditor from "~/components/ui-components/text-editor";

import axios from "axios";

const ContentInfo = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const newsData = useSelector(selectActiveNews);

    const [content, setContent] = useState('');

    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (newsData) {
            const {text} = newsData;
            setContent(text || '');
        }
    }, [newsData]);

    const handlerSaveTextInfo = async () => {
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/news-manager/updateNews`,
                {
                    id: newsData.id,
                    text: content
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(setActiveNewsData({
                text: content
            }))
            dispatch(addMessage({
                type: 'success',
                text: 'Новость обновлена'
            }));
        } catch (e) {
            console.error(e);
            dispatch(addMessage({
                type: 'error',
                text: 'Не удалось обновить новость'
            }));
        } finally {
            setIsPending(false);
        }
    }

    return(
        <div className="plain-container plain-row-container">
            <h1 className="header">Контент</h1>
            <span className="plain-text">Допускается вставка изображений не более 600Кб в сумме</span>
            <div style={{minHeight: 500, alignContent: 'stretch', display: 'grid'}}>
                <TextEditor value={content} changeEvent={(value) => setContent(value)}/>
            </div>
            <PlainButton disabled={content === '' || content === '<p><br></p>'}
                         className={'plain-button'} clickEvent={handlerSaveTextInfo}>Сохранить</PlainButton>
            {isPending && <PlainLoader className={'plain-loader'}/>}
        </div>
    )
}

export default ContentInfo;