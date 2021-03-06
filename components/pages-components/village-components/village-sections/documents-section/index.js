import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";

import {selectIndex, selectToken} from "~/store/reducers/manager";
import {addInfo, selectVillageInfo} from "~/store/reducers/village";
import {addMessage} from "~/store/reducers/messages";

import classes from './documents-section.module.scss'

import PlainLoader from "~/components/ui-components/plain-loader";
import PlainList from "~/components/ui-components/list-components/plain-list";
import SingleFileLoader from "~/components/ui-components/single-file-loader";

import axios from "axios";

const DocumentsSection = () => {
    const token = useSelector(selectToken)
    const villageInfo = useSelector(selectVillageInfo)
    const managerId = useSelector(selectIndex)
    const dispatch = useDispatch()

    const [isPending, setIsPending] = useState(false)
    const [documents, setDocuments] = useState([])

    useEffect(() => {
        const {documents} = villageInfo
        setDocuments(documents || [])
    }, [villageInfo])

    const addDocument = async (data) => {
        const createdDocument = await handlerCreateFieldDocument({
            complex_index: null,
            village_index: villageInfo.id,
            name: data.name,
            link: data.url
        })
        const tempDocuments = [
            ...documents,
            createdDocument
        ]
        setDocuments(tempDocuments)
        dispatch(addInfo({documents: [...tempDocuments]}))
    }

    const handlerCreateFieldDocument = async (data = {}) => {
        try {
            setIsPending(true)
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/createDocument`,
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
                section_name: "document",
                village_index: villageInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: '???????????? ?????????????????? ??????????????',
                lifetime: 5
            }))
            return response.data
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: '?????????????????? ???????????? ?????? ???????????????? ???????????? ??????????????????',
                lifetime: 5
            }))
            return new Error(e)
        } finally {
            setIsPending(false)
        }
    }

    const handlerDeleteFile = async (index) => {
        let result = []
        for (const [id, document] of documents.entries()) {
            if (id !== index) {
                result = [...result, document]
            } else {
                await deleteFileFromServer(document.link.replace(process.env.NEXT_PUBLIC_SERVER_URL, ''))
                await deleteDocumentFromServer(document.id)
            }
        }
        setDocuments(result)
        dispatch(addInfo({documents: [...result]}))
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
                text: '???????????????? ?????????????? ????????????',
                lifetime: 5
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: '?????????????????? ???????????? ?????? ???????????????? ??????????',
                lifetime: 5
            }))
            return new Error(e)
        } finally {
            setIsPending(false)
        }
    }

    const deleteDocumentFromServer = async (index) => {
        try {
            setIsPending(true)
            await axios.delete(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/deleteDocument/${index}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(addMessage({
                type: 'success',
                text: '???????????? ?????????????????? ??????????????',
                lifetime: 5
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: '?????????????????? ???????????? ?????? ???????????????? ???????????? ??????????????????',
                lifetime: 5
            }))
            return new Error(e)
        } finally {
            setIsPending(false)
        }
    }

    return(
        <div className={`${classes.container} row`}>
            <h1 className='header'>??????????????????</h1>
            <PlainList
                elements={documents.map(element => element.name)}
                isDeleted={true}
                deleteEvent={(value) => handlerDeleteFile(Number(value))}
            />
            <SingleFileLoader
                urlLoad={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/uploadFile`}
                pathLoad={`villages/${villageInfo.id}/documents/`}
                loadEvent={addDocument}
            />
            {isPending && <PlainLoader className={classes.loader}/>}
        </div>
    )
}

export default DocumentsSection;