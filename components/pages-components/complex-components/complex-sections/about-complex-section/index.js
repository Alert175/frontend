import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import SingleImageLoader from "~/components/ui-components/single-image-loader";
import ShowImage from "~/components/ui-components/show-image";
import TextEditor from "~/components/ui-components/text-editor";

import {useState, useEffect} from "react";

import axios from 'axios';

import {useDispatch, useSelector} from "react-redux";
import {addInfo, selectComplexInfo} from "~/store/reducers/complex";
import {selectIndex, selectToken} from "~/store/reducers/manager";
import {addMessage} from "~/store/reducers/messages";

const AboutComplexSection = () => {
    const [isPending, setIsPending] = useState(false);

    const [textContent, setTextContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const complexInfo = useSelector(selectComplexInfo);
    const token = useSelector(selectToken);
    const managerId = useSelector(selectIndex);
    const dispatch = useDispatch();

    useEffect(() => {
        const {about_text, about_image} = complexInfo;
        setTextContent(about_text || '');
        setImageUrl(about_image || '');
    }, [complexInfo])

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
            console.log(complexInfo.url)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateComplex`,
                {
                    id: complexInfo.id,
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
                complex_index: complexInfo.id
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
            <h1>О жилом комплексе</h1>
            <span className="plain-text">Не более 1000 символов</span>
            <div style={{minHeight: '500px', display: 'grid', alignContent: 'stretch'}}>
                <TextEditor value={textContent} changeEvent={(value) => setTextContent(value)}
                            style={{border: !handlerAccess() ? '1px solid red' : '1px solid black'}}/>
            </div>
            <div className="plain-row-container">
                <SingleImageLoader label={'Изображение (jpeg, jpg, png)'}
                                   fileName={imageUrl.split('/')[imageUrl.split('/').length - 1]}
                                   pathLoad={`images/complexes/${complexInfo.id}`}
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

export default AboutComplexSection;