import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";

import {selectToken} from "~/store/reducers/manager";
import {selectActiveArticle, setActiveArticlesData} from "~/store/reducers/article";
import {addMessage} from "~/store/reducers/messages";

import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import TextEditor from "~/components/ui-components/text-editor";

import axios from "axios";

const ContentInfo = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const articleData = useSelector(selectActiveArticle);

    const [content, setContent] = useState('');

    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (articleData) {
            const {text} = articleData;
            setContent(text || '');
        }
    }, [articleData]);

    const handlerSaveTextInfo = async () => {
        try {
            setIsPending(true);
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/news-manager/updateArticle`,
                {
                    id: articleData.id,
                    text: content
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(setActiveArticlesData({
                text: content
            }))
            dispatch(addMessage({
                type: 'success',
                text: 'Статья обновлена'
            }));
        } catch (e) {
            console.error(e);
            dispatch(addMessage({
                type: 'error',
                text: 'Не удалось обновить статью'
            }));
        } finally {
            setIsPending(false);
        }
    }

    return(
        <div className="plain-container plain-row-container">
            <h1 className="header">Контент</h1>
            <span className="plain-text">Допускается вставка изображений не более 600 Кб в сумме</span>
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