import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import SingleImageLoader from "~/components/ui-components/single-image-loader";
import ShowImage from "~/components/ui-components/show-image";
import TextEditor from "~/components/ui-components/text-editor";

import {useState, useEffect} from "react";

import axios from 'axios';

import {useDispatch, useSelector} from "react-redux";
import {addInfo, selectVillageInfo} from "~/store/reducers/village";
import {selectIndex, selectToken} from "~/store/reducers/manager";
import {addMessage} from "~/store/reducers/messages";

const AboutVillageSection = () => {
    const [isPending, setIsPending] = useState(false);

    const [textContent, setTextContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const villageInfo = useSelector(selectVillageInfo);
    const token = useSelector(selectToken);
    const managerId = useSelector(selectIndex)
    const dispatch = useDispatch();

    useEffect(() => {
        const {about_text, about_image} = villageInfo;
        setTextContent(about_text || '');
        setImageUrl(about_image || '');
    }, [villageInfo])

    /**
     * Проверка на заполненость конента
     * @returns {boolean}
     */
    const handlerAccess = () => {
        return !(!textContent || textContent === '<p><br></p>');
    }

    const updateComplexInfo = async () => {
        try {
            setIsPending(true)
            console.log(villageInfo.url)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateVillage`,
                {
                    id: villageInfo.id,
                    about_text: textContent,
                    about_image: imageUrl
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
                section_name: "about",
                village_index: villageInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: 'Данные успешно обновлены',
                lifetime: 5
            }))
            dispatch(addInfo({
                about_text: textContent,
                about_image: imageUrl
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

    return (
        <div className={'plain-container plain-row-container'}>
            <h1>О коттеджном поселке</h1>
            <span className="plain-text">Не более 1000 символов</span>
            <div style={{minHeight: '500px', display: 'grid', alignContent: 'stretch'}}>
                <TextEditor value={textContent} changeEvent={(value) => setTextContent(value)}
                            style={{border: !handlerAccess() ? '1px solid red' : '1px solid black'}}/>
            </div>
            <div className="plain-row-container">
                <SingleImageLoader label={'Изображение (jpeg, jpg, png)'}
                                   fileName={imageUrl.split('/')[imageUrl.split('/').length - 1]}
                                   pathLoad={`images/villages/${villageInfo.id}`}
                                   urlLoad={`/api/db/content-manager/uploadImage`}
                                   imageConfig={{
                                       height: 700,
                                       width: 700,
                                       fit: 'cover'
                                   }}
                                   loadEvent={(value) => setImageUrl(value.url)} className={'plain-button'}/>
                <ShowImage label={'Изображение'} path={imageUrl}
                           containerStyles={{width: 300}}
                           imageStyles={{height: 300, width: 300, background: 'gray', borderRadius: 5, objectFit: 'cover'}}/>
            </div>
            <div className="plain-button">
                <PlainButton disabled={!handlerAccess()}
                             clickEvent={updateComplexInfo}>Сохранить</PlainButton>
            </div>
            {isPending && <PlainLoader className='plain-loader'/>}
        </div>
    )
}

export default AboutVillageSection;