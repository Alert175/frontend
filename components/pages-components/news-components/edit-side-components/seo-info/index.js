import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";

import {selectToken} from "~/store/reducers/manager";
import {selectActiveNews, setActiveNewsData} from "~/store/reducers/news";
import {addMessage} from "~/store/reducers/messages";

import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import TextInput from "~/components/ui-components/text-input";
import PlainTextarea from "~/components/ui-components/plain-textarea";

import axios from "axios";

const SeoInfo = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const newsData = useSelector(selectActiveNews);

    const [tittle, setTittle] = useState('');
    const [description, setDescription] = useState('');

    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (newsData) {
            const {web_tittle, web_description} = newsData;
            setTittle(web_tittle || '');
            setDescription(web_description || '');
        }
    }, [newsData]);

    const handlerSaveSeoInfo = async () => {
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/news-manager/updateNews`,
                {
                    id: newsData.id,
                    web_tittle: tittle,
                    web_description: description
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(setActiveNewsData({
                web_tittle: tittle,
                web_description: description
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