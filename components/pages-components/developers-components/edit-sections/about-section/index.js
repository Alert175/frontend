import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import TextEditor from "~/components/ui-components/text-editor";
import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import TextInput from "~/components/ui-components/text-input";
import NumberInput from "~/components/ui-components/number-input";
import SingleImageLoader from "~/components/ui-components/single-image-loader";
import ShowImage from "~/components/ui-components/show-image";

import { addInfo, selectDeveloperInfo } from "~/store/reducers/developer";
import { selectIndex, selectToken } from "~/store/reducers/manager";
import { addMessage } from "~/store/reducers/messages";

import axios from "axios";

const AboutSection = () => {
    const developerInfo = useSelector(selectDeveloperInfo);
    const token = useSelector(selectToken);
    const dispatch = useDispatch();

    const managerId = useSelector(selectIndex)

    const [isPending, setIsPending] = useState(false);

    const [aboutContent, setAboutContent] = useState('');
    const [dateCreate, setDateCreate] = useState('');
    const [developerLink, setDeveloperLink] = useState('');
    const [developerRating, setDeveloperRating] = useState(0);
    const [aboutImage, setAboutImage] = useState('');

    useEffect(() => {
        const { about, date_create, rating, link, about_image } = developerInfo;
        setAboutContent(about || '');
        setDateCreate(date_create || '');
        setDeveloperRating(rating || 0);
        setDeveloperLink(link || '');
        setAboutImage(about_image || '');
    }, [developerInfo]);

    /**
     * Проверка на заполненость конента
     * @returns {boolean}
     */
    const handlerAccess = () => {
        return !(!aboutContent || aboutContent === '<p><br></p>' || !dateCreate || !developerRating); // || !aboutImage
    }

    const handlerUpdateDeveloperInfo = async () => {
        try {
            setIsPending(true);
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateDeveloper`,
                {
                    id: developerInfo.id,
                    about: aboutContent,
                    date_create: dateCreate,
                    link: developerLink,
                    rating: developerRating,
                    about_image: aboutImage
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            dispatch(addMessage({
                type: 'success',
                text: 'Застройщик обновлен',
                lifetime: 5
            }));
            dispatch(addInfo({
                about: aboutContent,
                date_create: dateCreate,
                link: developerLink,
                rating: developerRating,
                about_image: aboutImage
            }));
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/add-action`, {
                content_manager_index: managerId,
                action_type: "update",
                section_name: "about",
                developer_index: developerInfo.id
            });
        } catch (e) {
            console.error(e);
            dispatch(addMessage({
                type: 'error',
                text: 'Произошла ошибка при обновлении застройщика',
                lifetime: 5
            }));
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className='plain-container plain-row-container'>
            <h1 className="header">О застройщике</h1>
            <div style={{ minHeight: '500px', display: 'grid', alignContent: 'stretch' }}>
                <TextEditor value={aboutContent} changeEvent={(value) => setAboutContent(value)}
                    style={{ border: aboutContent === '' || aboutContent === '<p><br></p>' ? '1px solid red' : '1px solid black' }} />
            </div>
            <div className={'plain-column-container'}>
                <TextInput label={'Дата основания'} value={dateCreate} changeValue={(value) => setDateCreate(value)}
                    style={{ border: dateCreate === '' ? '1px solid red' : '1px solid black' }} />
                <TextInput label={'Ссылка на сайт застройщика'} value={developerLink} changeValue={(value) => setDeveloperLink(value)} />
                <NumberInput label={'Рейтинг застройщика'} value={developerRating} changeValue={(value) => setDeveloperRating(value)}
                    style={{ border: developerRating === 0 ? '1px solid red' : '1px solid black' }} />
            </div>
            <div className="plain-row-container-container">
                <SingleImageLoader label={'Изображение (jpeg, jpg, png)'}
                    fileName={aboutImage.split('/')[aboutImage.split('/').length - 1]}
                    pathLoad={`images/developers/${developerInfo.id}`}
                    urlLoad={`/api/db/content-manager/uploadImage`}
                    imageConfig={{
                        height: 700,
                        width: 700,
                        fit: 'cover'
                    }}
                    loadEvent={(value) => setAboutImage(value.url)} className={'plain-button'}
                    style={{ border: aboutImage === '' ? '1px solid red' : '1px solid black' }} />
                <ShowImage label={'Изображение'} path={aboutImage}
                    containerStyles={{ width: 300 }}
                    imageStyles={{ height: 300, width: 300, background: 'gray', borderRadius: 5, objectFit: 'cover' }} />
            </div>
            <div className="plain-button">
                <PlainButton disabled={!handlerAccess()}
                    clickEvent={handlerUpdateDeveloperInfo}>Сохранить</PlainButton>
            </div>
            {isPending && <PlainLoader className='plain-loader' />}
        </div>
    )
}

export default AboutSection;