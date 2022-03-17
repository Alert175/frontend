import classes from './seo-section.module.scss'

import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";

import TextInput from "~/components/ui-components/text-input";
import PlainTextarea from "~/components/ui-components/plain-textarea";
import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";

import {addInfo, selectDeveloperInfo} from "~/store/reducers/developer";
import {selectIndex, selectToken} from "~/store/reducers/manager";

import axios from "axios";
import {addMessage} from "~/store/reducers/messages";

const SeoSection = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isPending, setIsPending] = useState(false)

    const developerInfo = useSelector(selectDeveloperInfo)
    const token = useSelector(selectToken)
    const managerId = useSelector(selectIndex)
    const dispatch = useDispatch()

    useEffect(() => {
        const {web_title, web_description, name} = developerInfo
        setTitle(web_title || `Застройщик ${name}`)
        setDescription(web_description || `Застройщик ${name}. Стоимость жилья, о застройщике, жилые комплексы, коттеджные поселки, галерея, новости застройщика, контакты застройщика`)
    }, [developerInfo])

    const handlerUpdateSeoInfo = async () => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateDeveloper`,
                {
                    id: developerInfo.id,
                    web_title: title,
                    web_description: description
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
                developer_index: developerInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: 'Застройщик обновлен',
                lifetime: 5
            }))
            dispatch(addInfo({
                web_title: title,
                web_description: description
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'Произошла ошибка при обновлении застройщика',
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