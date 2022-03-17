import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";

import {selectToken} from "~/store/reducers/manager";
import {selectActiveArticle, setActiveArticlesData} from "~/store/reducers/article";
import {addMessage} from "~/store/reducers/messages";

import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import TextInput from "~/components/ui-components/text-input";
import PlainTextarea from "~/components/ui-components/plain-textarea";

import axios from "axios";

const SeoInfo = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const articleData = useSelector(selectActiveArticle);

    const [tittle, setTittle] = useState('');
    const [description, setDescription] = useState('');

    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (articleData) {
            const {web_tittle, web_description} = articleData;
            setTittle(web_tittle || '');
            setDescription(web_description || '');
        }
    }, [articleData]);

    const handlerSaveSeoInfo = async () => {
        try {
            setIsPending(true);
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/news-manager/updateArticle`,
                {
                    id: articleData.id,
                    web_tittle: tittle,
                    web_description: description
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(setActiveArticlesData({
                web_tittle: tittle,
                web_description: description
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
            <h1 className="header">Для SEO</h1>
            <div className="plain-column-container">
                <TextInput label={'Заголовок WEB Страницы'} value={tittle} changeValue={(value) => setTittle(value)}/>
                <PlainTextarea label={'Описание WEB Страницы'} value={description} changeValue={(value) => setDescription(value)}/>
            </div>
            <PlainButton disabled={!tittle || !description}
                         className={'plain-button'} clickEvent={handlerSaveSeoInfo}>Сохранить</PlainButton>
            {isPending && <PlainLoader className={'plain-loader'}/>}
        </div>
    )
}

export default SeoInfo;