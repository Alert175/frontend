import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {selectIndex, selectToken} from "~/store/reducers/manager";
import {addInfo, selectVillageInfo} from "~/store/reducers/village";
import {addMessage} from "~/store/reducers/messages";

import classes from './gallery-section.module.scss'

import PlainList from "~/components/ui-components/list-components/plain-list";
import SingleImageLoader from "~/components/ui-components/single-image-loader";
import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";

import axios from "axios";

const GallerySection = () => {
    const token = useSelector(selectToken)
    const managerId = useSelector(selectIndex)
    const villageInfo = useSelector(selectVillageInfo)
    const dispatch = useDispatch()

    const [showWarning, setShowWarning] = useState(false)
    const [images, setImages] = useState([])
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        const {gallery} = villageInfo
        setImages(gallery || [])
    }, [villageInfo])

    const addImage = (value) => {
        setImages(prevState => [...prevState, value])
        setShowWarning(true)
    }

    const deleteImage = (index) => {
        let result = []
        let deleteImageSource = ''
        for (const [id, image] of images.entries()) {
            if (id !== index) {
                result = [...result, image]
            } else {
                deleteImageSource = image.replace(process.env.NEXT_PUBLIC_SERVER_URL, '')
            }
        }
        if (!deleteImageSource) {
            return
        }
        deleteImageFromServer(deleteImageSource)
            .then(() => {
                setImages(result)
                setShowWarning(true)
            })
    }

    const deleteImageFromServer = async (url) => {
        try {
            setIsPending(true)
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/deleteFile`,
                {
                    path: url
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(addMessage({
                type: 'success',
                text: 'Изображение успешно удалено',
                lifetime: 5
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'Произошла ошибка при удалении файла',
                lifetime: 5
            }))
            return new Error(e)
        } finally {
            setIsPending(false)
        }
    }

    const updateGalleryData = async () => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateVillage`,
                {
                    id: villageInfo.id,
                    gallery: [...images]
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
                section_name: "gallery",
                village_index: villageInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: 'Данные успешно обновлены',
                lifetime: 5
            }))
            dispatch(addInfo({gallery: [...images]}))
            setShowWarning(false)
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
        <div className={`${classes.container} row`}>
            <h1 className="header">Фотогалерея</h1>
            <PlainList
                elements={images.map(element => element.split('/')[element.split('/').length - 1])}
                isDeleted={true}
                deleteEvent={(value) => deleteImage(Number(value))}
                style={{border: images.length < 1 ? '1px solid red' : '1px solid black'}}
            />
            <SingleImageLoader urlLoad={'/api/db/content-manager/uploadImage'}
                               pathLoad={`villages/${villageInfo.id}/images/gallery`}
                               loadEvent={(value) => addImage(value.url)}/>
            <PlainButton disabled={!showWarning} clickEvent={updateGalleryData}>
                <span className='plain-text font-medium'>Сохранить</span>
            </PlainButton>
            {isPending && <PlainLoader className={classes.loader}/>}
        </div>
    )
}

export default GallerySection;