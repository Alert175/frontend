import TextInput from "~/components/ui-components/text-input";
import SingleImageLoader from "~/components/ui-components/single-image-loader";
import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import ShowImage from "~/components/ui-components/show-image";

import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";
import {selectDeveloperInfo} from "~/store/reducers/developer";
import {selectIndex, selectToken} from "~/store/reducers/manager";
import {addInfo} from "~/store/reducers/developer";
import {addMessage} from "~/store/reducers/messages";
import axios from "axios";

import stringUtils from 'utils/string.utils'

const GeneralSection = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const managerId = useSelector(selectIndex);
    const developerInfo = useSelector(selectDeveloperInfo);

    const [name, setName] = useState('');
    const [logo, setLogo] = useState('');
    const [mainImage, setMainImage] = useState('');

    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (developerInfo) {
            const {name: developerName, logo_image, main_image} = developerInfo;
            setName(developerName || '');
            setLogo(logo_image || '');
            setMainImage(main_image || '');
        }
    }, [developerInfo])

    const updateDeveloper = async () => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateDeveloper`,
                {
                    id: developerInfo.id,
                    name,
                    logo_image: logo,
                    main_image: mainImage,
                    // url: developerInfo.url === null ? stringUtils.urlValidator(stringUtils.convertToTransliteration(name)) : developerInfo.url,
                    url: stringUtils.urlValidator(`developers/${stringUtils.convertToTransliteration(name)}`)
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
                developer_index: developerInfo.id
            });
            dispatch(addInfo({
                name,
                logo_image: logo,
                main_image: mainImage,
                // url: stringUtils.urlValidator(stringUtils.convertToTransliteration(name))
                url: developerInfo.url === null ? stringUtils.urlValidator(stringUtils.convertToTransliteration(name)) : developerInfo.url
            }))
            dispatch(addMessage({
                type: 'success',
                text: `Застройщик обновлен`
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: `Ошибка при обновлении застройщика`
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
        return developerInfo.url === null
            ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/developers/${stringUtils.urlValidator(stringUtils.convertToTransliteration(name))}_${developerInfo.id}`
            : `${process.env.NEXT_PUBLIC_PORTAL_URL}/${developerInfo.url}`;
    }

    return (
        <div className='plain-container plain-row-container'>
            <h1 className="header">Основная информация</h1>
            <div className='plain-column-container'>
                <TextInput label={'Название застройщика'} value={name} changeValue={(value) => setName(value)}
                           style={{border: name === '' ? '1px solid red' : '1px solid black'}}/>
                <SingleImageLoader label={'Логотип (jpeg, jpg, png)'}
                                   fileName={logo.split('/')[logo.split('/').length - 1]}
                                   pathLoad={`images/developers/${developerInfo.id}`}
                                   urlLoad={`/api/db/content-manager/uploadImage`}
                                   imageConfig={{
                                       height: 200,
                                       width: 500,
                                       fit: 'contain'
                                   }}
                                   loadEvent={(value) => setLogo(value.url)}
                                   style={{border: logo === '' ? '1px solid red' : '1px solid black'}}
                />
                <SingleImageLoader label={'Главное изображение (jpeg, jpg, png)'}
                                   fileName={mainImage.split('/')[mainImage.split('/').length - 1]}
                                   pathLoad={`images/developers/${developerInfo.id}`}
                                   urlLoad={`/api/db/content-manager/uploadImage`}
                                   imageConfig={{
                                       height: 1080,
                                       width: 1920,
                                       fit: 'cover'
                                   }}
                                   loadEvent={(value) => setMainImage(value.url)}
                                   style={{border: mainImage === '' ? '1px solid red' : '1px solid black'}}/>
            </div>
            <span className={'plain-text font-medium'}>
                Ссылка на застройщика:{' '}
                {/* eslint-disable-next-line */}
                <a href={handlerComputedUrl()} target={'_blank'}>{handlerComputedUrl()}</a>
            </span>
            <ShowImage label={'Логотип застройщика'} className={'contain-image'} path={logo}
                       containerStyles={{width: 300}}
                       imageStyles={{height: 100, width: 300, background: 'gray', borderRadius: 5, objectFit: 'contain'}}/>
            <ShowImage label={'Главное изображение'} className={'contain-image'} path={mainImage}
                       containerStyles={{width: 400}}
                       imageStyles={{height: 250, width: 400, background: 'gray', borderRadius: 5, objectFit: 'cover'}}/>
            <div className='plain-button'>
                <PlainButton clickEvent={updateDeveloper}
                             disabled={!name}>Сохранить</PlainButton>
            </div>
            {isPending && <PlainLoader className={'plain-loader'}/>}
        </div>
    )
}

export default GeneralSection;