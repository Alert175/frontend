import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";

import {addInfo, selectVillageInfo} from "~/store/reducers/village";
import {selectIndex, selectToken} from "~/store/reducers/manager";
import {addMessage} from "~/store/reducers/messages";

import PlainList from "~/components/ui-components/list-components/plain-list";
import PlainLoader from "~/components/ui-components/plain-loader";
import SingleImageLoader from "~/components/ui-components/single-image-loader";
import PlainButton from "~/components/ui-components/plain-button";
import TextInput from "~/components/ui-components/text-input";

import classes from './progress-section.module.scss'

import axios from "axios";

const ProgressSection = () => {
    const villageInfo = useSelector(selectVillageInfo)
    const token = useSelector(selectToken)
    const managerId = useSelector(selectIndex)

    const dispatch = useDispatch()

    const [reports, setReports] = useState([])
    const [activeReport, setActiveReport] = useState(null)
    const [newReport, setNewReport] = useState('')
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        const {progress} = villageInfo
        setReports(progress || [])
    }, [villageInfo])

    const createProgress = async () => {
        try {
            setIsPending(true)
            const data = {
                complex_index: null,
                village_index: villageInfo.id,
                date: newReport
            }
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/createProgress`,
                {...data},
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/add-action`, {
                content_manager_index: managerId,
                action_type: "update",
                section_name: "progress",
                village_index: villageInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: 'Ход строительства создан'
            }))
            setActiveReport(null)
            setReports(prevState => [...prevState, response.data])
            dispatch(addInfo({
                progress: [...reports, response.data]
            }))
            setNewReport('')
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'Ошибка при создании хода строительства'
            }))
        } finally {
            setIsPending(false)
        }
    }

    const handlerClearImages = async (deleteIndex) => {
        try {
            if (!Array.isArray(reports[deleteIndex].images)) {
                return
            }
            if (!reports[deleteIndex].images.length) {
                return
            }
            for (const image of reports[deleteIndex].images) {
                await deleteFileFromServer(image.replace(process.env.NEXT_PUBLIC_SERVER_URL, ''))
            }
        } catch (e) {
            console.error(e)
        }
    }

    const deleteProgress = async (deleteIndex) => {
        try {
            setIsPending(true)
            await handlerClearImages(deleteIndex)
            await axios.delete(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/deleteProgress/${reports[deleteIndex].id}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(addMessage({
                type: 'success',
                text: 'Ход строительства удален'
            }))
            setActiveReport(null)
            const validReports = reports.filter((element, index) => index !== deleteIndex)
            setReports([...validReports])
            dispatch(addInfo({
                progress: [...validReports]
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'Ошибка при удалении хода строительства'
            }))
        } finally {
            setIsPending(false)
        }
    }

    const updateProgress = async (data) => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateProgress`,
                {...data},
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(addMessage({
                type: 'success',
                text: 'Ход строительства обновлен'
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'Ошибка при обновлении хода строительства'
            }))
        } finally {
            setIsPending(false)
        }
    }

    const handlerAddImage = async (image) => {
        try {
            let currentReports = []
            reports.map((element, index) => {
                if (index === activeReport) {
                    const tempImages = Array.isArray(element.images) ? [...element.images] : []
                    currentReports = [...currentReports, {
                        ...element,
                        images: Array.isArray(element.images) ? [...tempImages, image.url] : [image.url]
                    }]
                } else {
                    currentReports = [...currentReports, element]
                }
            })
            setReports(currentReports)
            await updateProgress(currentReports[activeReport])
        } catch (e) {
            console.error(e)
        }
    }

    const deleteFileFromServer = async (url) => {
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

    const handlerDeleteImage = (deleteIndex) => {
        let currentReports = []
        let deleteUrl = ''
        reports.map((element, index) => {
            if (index === activeReport) {
                deleteUrl = element.images[deleteIndex].replace(process.env.NEXT_PUBLIC_SERVER_URL, '')
                currentReports = [...currentReports, {
                    ...element,
                    images: element.images.filter((element, index) => index !== deleteIndex)
                }]
            } else {
                currentReports = [...currentReports, element]
            }
        })
        deleteFileFromServer(deleteUrl)
            .then(() => updateProgress(currentReports[activeReport]))
            .then(() => setReports(currentReports))
    }

    return(
        <div className={`${classes.container} row`}>
            <h1 className='header'>Ход строительства</h1>
            <div className={`${classes.controlContainer} column`}>
                <div className={`${classes.container} row`}>
                    <PlainList
                        elements={reports.map(element => element.date)}
                        activeElement={activeReport}
                        isDeleted={true}
                        selectEvent={(value) => setActiveReport(value)}
                        deleteEvent={deleteProgress}
                        label={'Отчеты'}
                    />
                    <TextInput value={newReport} holder={'__.__.____'} changeValue={(value) => setNewReport(value)}/>
                    <PlainButton disabled={!newReport} clickEvent={createProgress}>
                        <span className='plain-text font-medium'>Добавить</span>
                    </PlainButton>
                </div>
                <div className={`${classes.container} row`}>
                    {activeReport !== null &&
                        <PlainList
                            elements={Array.isArray(reports[activeReport].images) ? reports[activeReport].images.map(element => element.split('/')[element.split('/').length - 1]) : []}
                            isDeleted={true}
                            deleteEvent={handlerDeleteImage}/>
                    }
                    {activeReport !== null &&
                        <SingleImageLoader
                        urlLoad={'/api/db/content-manager/uploadImage'}
                        pathLoad={`villages/${villageInfo.id}/images/progress`}
                        loadEvent={handlerAddImage}/>
                    }
                </div>
            </div>
            {isPending && <PlainLoader className={classes.loader}/>}
        </div>
    )
}

export default ProgressSection;