import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import SingleImageLoader from "~/components/ui-components/single-image-loader";
import ShowImage from "~/components/ui-components/show-image";
import TextInput from "~/components/ui-components/text-input";
import PlainTextarea from "~/components/ui-components/plain-textarea";
import SingleList from "~/components/ui-components/list-components/single-list";

import {useState, useEffect} from "react";

import axios from 'axios';

import classes from './index.module.scss';

import {useDispatch, useSelector} from "react-redux";
import {addInfo, selectVillageInfo} from "~/store/reducers/village";
import {selectIndex, selectToken} from "~/store/reducers/manager";
import {addMessage} from "~/store/reducers/messages";

const AdvantagesSection = () => {
    const villageInfo = useSelector(selectVillageInfo);
    const token = useSelector(selectToken);
    const managerId = useSelector(selectIndex);
    const dispatch = useDispatch();

    const [isPending, setIsPending] = useState(false);
    const [accessAdd, setAccessAdd] = useState(true);

    const [advantagesList, setAdvantagesList] = useState([]);
    const [activeAdvantage, setActiveAdvantage] = useState(null);
    const [header, setHeader] = useState('');
    const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const {advantages} = villageInfo;
        setAdvantagesList(advantages || []);
    }, [villageInfo]);

    useEffect(() => {
        if (activeAdvantage === null) {
            setHeader('');
            setText('');
            setImageUrl('');
            return;
        }
        const searchIndex = advantagesList.findIndex(element => element.id === activeAdvantage);
        if (searchIndex === -1) {
            return;
        }
        setHeader(advantagesList[searchIndex].name);
        setText(advantagesList[searchIndex].description);
        setImageUrl(advantagesList[searchIndex].image);
    }, [activeAdvantage]);

    /**
     * ?????????????? ???????????????????? ????????????????????????
     */
    const addAdvantage = async () => {
        try {
            setIsPending(true)
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/create-advantage`,
                {
                    village_index: villageInfo.id
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
                section_name: "advantages",
                village_index: villageInfo.id
            });
            const {id, complex_index, village_index, name, description, image} = response.data;
            setAdvantagesList(prevState => [...prevState, {
                id,
                complex_index,
                village_index,
                name: name || '',
                description: description || '',
                image: image || ''
            }]);
            dispatch(addMessage({
                type: 'success',
                text: '???????????????????????? ??????????????',
                lifetime: 5
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: '?????????????????? ???????????? ?????? ???????????????? ????????????????????????',
                lifetime: 5
            }))
        } finally {
            setIsPending(false)
        }
    }

    /**
     * ?????????????? ???????????????? ????????????????????????
     * @param index
     * @returns {Promise<void>}
     */
    const deleteAdvantage = async (index) => {
        try {
            setIsPending(true)
            const searchIndex = advantagesList.findIndex(element => element.id === index);
            if (searchIndex === -1) {
                return;
            }
            await deleteImageFromServer(advantagesList[searchIndex].image.replace(process.env.NEXT_PUBLIC_SERVER_URL, ''))
            await axios.delete(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/delete-advantage/${index}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            setActiveAdvantage(null);
            setAdvantagesList(prevState => prevState.filter(element => element.id !== index));
            dispatch(addMessage({
                type: 'success',
                text: '???????????????????????? ??????????????',
                lifetime: 5
            }));
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: '?????????????????? ???????????? ?????? ???????????????? ????????????????????????',
                lifetime: 5
            }))
        } finally {
            setIsPending(false)
        }
    }

    /**
     * ?????????????? ???????????????????? ????????????????????????
     * @param index
     * @returns {Promise<void>}
     */
    const updateAdvantage = async () => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/update-advantage/`,
                {
                    id: activeAdvantage,
                    name: header,
                    description: text,
                    image: imageUrl
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
                section_name: "advantages",
                village_index: villageInfo.id
            });
            const searchIndex = advantagesList.findIndex(element => element.id === activeAdvantage);
            if (searchIndex === -1) {
                dispatch(addMessage({
                    type: 'error',
                    text: '?????????????????? ???????????? ?????? ???????????????????? ????????????????????????',
                    lifetime: 5
                }));
                return;
            }
            let updatedAdvantagesList = []
            for (const advantage of advantagesList) {
                if (advantage.id === activeAdvantage) {
                    updatedAdvantagesList = [...updatedAdvantagesList, {
                        id: activeAdvantage,
                        complex_index: null,
                        village_index: villageInfo.id,
                        name: header,
                        description: text,
                        image: imageUrl
                    }]
                } else {
                    updatedAdvantagesList = [...updatedAdvantagesList, advantage ]
                }
            }
            dispatch(addInfo({
                advantages: updatedAdvantagesList
            }))
            setActiveAdvantage(null);
            dispatch(addMessage({
                type: 'success',
                text: '???????????????????????? ??????????????????',
                lifetime: 5
            }));
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: '?????????????????? ???????????? ?????? ???????????????????? ????????????????????????',
                lifetime: 5
            }))
        } finally {
            setIsPending(false)
        }
    }

    /**
     * ?????????????? ???????????????? ??????????????????????
     * @param url
     * @returns {Promise<any>}
     */
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
                text: '?????????????????????? ?????????????? ??????????????',
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

    return (
        <div className={'plain-container plain-row-container'}>
            <h1 className="header">???????????????????????? ????</h1>
            <div className={`plain-row-container`}>
                <div className={'plain-row-container plain-button'}>
                    <SingleList elements={advantagesList.map((element, index) => ({
                        text: element.name,
                        index: element.id ? element.id : index + 1e7
                    }))}
                                isDeleted={true}
                                activeElement={activeAdvantage} label={'???????????????????????? ????'}
                                selectEvent={(value) => setActiveAdvantage(value)}
                                deleteEvent={deleteAdvantage}/>
                    <PlainButton clickEvent={addAdvantage}>
                        ????????????????
                    </PlainButton>
                </div>
                {
                    activeAdvantage !== null
                    &&
                    <div className={'plain-row-container'}>
                        <div className={'plain-column-container'}>
                            <TextInput label={'??????????????????'} value={header} changeValue={(value) => setHeader(value)}/>
                            <SingleImageLoader label={'?????????????????????? (jpeg, jpg, png)'}
                                               fileName={imageUrl.split('/')[imageUrl.split('/').length - 1]}
                                               pathLoad={`images/complexes/${villageInfo.id}/advantages`}
                                               urlLoad={`/api/db/content-manager/uploadImage`}
                                               imageConfig={{
                                                   height: 700,
                                                   width: 700,
                                                   fit: 'cover'
                                               }}
                                               loadEvent={(value) => setImageUrl(value.url)}/>
                        </div>
                        <ShowImage label={'??????????????????????'} path={imageUrl}
                                   containerStyles={{width: 150}}
                                   imageStyles={{
                                       height: 150,
                                       width: 150,
                                       background: 'gray',
                                       borderRadius: 5,
                                       objectFit: 'cover'
                                   }}/>
                        <PlainTextarea label={'??????????'} value={text} changeValue={(value) => setText(value)}/>
                        <PlainButton className={'plain-button'} clickEvent={updateAdvantage}
                                     disabled={!header || !imageUrl || !text}>??????????????????</PlainButton>
                    </div>
                }
            </div>
            {isPending && <PlainLoader className={'plain-loader'}/>}
        </div>
    )
}

export default AdvantagesSection;