import classes from './seo-section.module.scss'

import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";

import TextInput from "~/components/ui-components/text-input";
import PlainTextarea from "~/components/ui-components/plain-textarea";
import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";

import {addInfo, selectComplexInfo} from "~/store/reducers/complex";
import {selectIndex, selectToken} from "~/store/reducers/manager";

import axios from "axios";
import {addMessage} from "~/store/reducers/messages";

const SeoSection = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [link, setLink] = useState('')
    const [isPending, setIsPending] = useState(false)

    const complexInfo = useSelector(selectComplexInfo)
    const token = useSelector(selectToken)
    const managerId = useSelector(selectIndex)
    const dispatch = useDispatch()

    useEffect(() => {
        const {title_web, description_web, link, cityName, name} = complexInfo
        setTitle(title_web || `Жилой комплекс ${name}`)
        setDescription(description_web || `Жилой комплекс ${name} в городе ${cityName}. Информация о ЖК. Месторасположение и инфраструктура. Планировки и цены. Преимущества и недостатки. Новости и акции. Галерея и ход строительства. Калькулятор ипотеки, способы оплаты, банки-партнеры. Документы. Контакты.`)
        setLink(link || '')
    }, [complexInfo])

    const handlerUpdateSeoInfo = async () => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateComplex`,
                {
                    id: complexInfo.id,
                    title_web: title,
                    description_web: description,
                    link
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/add-action`, {
                content_manager_index: managerId,
                action_type: "update",
                section_name: "seo",
                complex_index: complexInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: 'Данные успешно обновлены',
                lifetime: 5
            }))
            dispatch(addInfo({
                title_web: title,
                description_web: description,
                link
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'Произошла ошибка при обновлении данных',
                lifetime: 5
            }))
        } finally {
            setIsPending(false)
        }
    }

    return(
        <div className={`${classes.seoContainer} row`}>
            <h1 className='header'>Для SEO</h1>
            <div className='column' style={{gap: '20px'}}>
                <TextInput value={title} label={'Заголовок'} holder={'Введите заголовок'} changeValue={(value) => setTitle(value)}
                           style={{border: title === '' ? '1px solid red' : '1px solid black'}}/>
                <TextInput value={link} label={'Внешняя ссылка'} holder={'Введите ссылку'} changeValue={(value) => setLink(value)}/>
            </div>
            <PlainTextarea value={description} label={'Описание'} holder={'Введите описание'} changeValue={(value) => setDescription(value)}
                           style={{border: description === '' ? '1px solid red' : '1px solid black'}}/>
            <PlainButton styleConfig={{width: '360px'}} disabled={!title || !description} clickEvent={handlerUpdateSeoInfo}>
                <span className='plain-text font-medium'>Сохранить</span>
            </PlainButton>
            {isPending && <PlainLoader className={classes.loader}/>}
        </div>
    )
}

export default SeoSection;