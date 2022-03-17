import classes from './main-section.module.scss'

import {useState, useEffect} from "react";
import {useSelector, useDispatch} from 'react-redux';

import {selectVillageInfo} from "~/store/reducers/village";
import {addInfo} from "~/store/reducers/village";
import {addMessage} from "~/store/reducers/messages";
import {selectIndex, selectToken} from "~/store/reducers/manager";

import TextInput from "~/components/ui-components/text-input";
import PlainCheckbox from "~/components/ui-components/plain-checkbox";
import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import ShowImage from "~/components/ui-components/show-image";
import SingleImageLoader from "~/components/ui-components/single-image-loader";

import stringUtils from 'utils/string.utils'

import axios from "axios";

const MainSection = () => {
    const [name, setName] = useState('')
    const [deadline, setDeadline] = useState('')
    const [link, setLink] = useState('')
    const [mainImage, setMainImage] = useState('')
    const [urlAddress, setUrlAddress] = useState('')
    const [isHanded, setIsHanded] = useState(false)

    const [isPending, setIsPending] = useState(false)

    const dispatch = useDispatch()
    const villageInfo = useSelector(selectVillageInfo)
    const token = useSelector(selectToken)
    const managerId = useSelector(selectIndex)

    useEffect(() => {
        const {name, is_handed, url, main_image, deadline, link} = villageInfo
        setName(name || '')
        setMainImage(main_image || '')
        setDeadline(deadline || '')
        setLink(link || '')
        setIsHanded(is_handed || false)
        setUrlAddress(url)
    }, [villageInfo])

    const validatorUrlAddress = () => {
        const {regionName, cityName, developerName} = villageInfo
        const transliterationUrl = stringUtils.convertToTransliteration(`villages/${regionName}/${cityName}/${name}`)
        const validateUrl = stringUtils.urlValidator(transliterationUrl)
        setUrlAddress(validateUrl)
    }

    useEffect(() => {
        if (!name) {
            return
        }
        validatorUrlAddress()
    }, [name])

    const updateComplexInfo = async () => {
        try {
            setIsPending(true)
            console.log(villageInfo.url)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateVillage`,
                {
                    id: villageInfo.id,
                    name: name,
                    main_image: mainImage,
                    is_handed: isHanded,
                    deadline,
                    link,
                    url: villageInfo.url === null || villageInfo.url === '' ? urlAddress : villageInfo.url
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
                section_name: "general",
                village_index: villageInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: 'Данные успешно обновлены',
                lifetime: 5
            }))
            dispatch(addInfo({
                name: name,
                main_image: mainImage,
                is_handed: isHanded,
                deadline,
                link,
                url: villageInfo.url === null || villageInfo.url === '' ? urlAddress : villageInfo.url
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

    /**
     * Вычисление валидной ссылки на объект
     * @returns {`${string}/developers/`|string}
     */
    const handlerComputedUrl = () => {
        return villageInfo.url === null || villageInfo.url === ''
            ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/${urlAddress}_${villageInfo.id}`
            : `${process.env.NEXT_PUBLIC_PORTAL_URL}/${villageInfo.url}`;
    }

    return (
        <div className={`${classes.mainContainer} row`}>
            <h1 className="header">Основная информация</h1>
            <div className={`column ${classes.inputsContainer}`}>
                <TextInput label={'Название ЖК'} holder={''} value={name}
                           changeValue={(value) => setName(value)}
                           style={{border: name === '' ? '1px solid red' : '1px solid black'}}/>
                <TextInput label={'Ссылка на сайт'} holder={''} value={link}
                           changeValue={(value) => setLink(value)}/>
                <TextInput label={'Срок сдачи'} holder={''} value={deadline}
                           changeValue={(value) => setDeadline(value)}
                           style={{border: deadline === '' ? '1px solid red' : '1px solid black'}}/>
                <PlainCheckbox isChecked={isHanded} label={'Дом сдан'} checkEvent={() => setIsHanded(!isHanded)}/>
            </div>
            <SingleImageLoader urlLoad={'/api/db/content-manager/uploadImage'}
                               className={'plain-button'}
                               pathLoad={`villages/${villageInfo.id}/images/main`}
                               loadEvent={(value) => setMainImage(value.url)}
                               imageConfig={{
                                   height: 1080,
                                   width: 1920,
                                   fit: 'cover'
                               }}/>
            <ShowImage label={'Главное изображение'} className={'contain-image'} path={mainImage}
                       containerStyles={{width: 300}}
                       imageStyles={{height: 300, width: 300, background: 'gray', borderRadius: 5, objectFit: 'cover'}}/>
            <p>
                <span className='plain-text font bold'>Адрес страницы ЖК: </span>
                {/* eslint-disable-next-line */}
                <a href={handlerComputedUrl()} target={'_blank'}>{handlerComputedUrl()}</a>
            </p>
            <PlainButton disabled={!name || !deadline}
                         className={'plain-button'}
                         clickEvent={updateComplexInfo}>
                <span>Сохранить</span>
            </PlainButton>
            {isPending && <PlainLoader className={classes.loader}/>}
        </div>
    )
}

export default MainSection;