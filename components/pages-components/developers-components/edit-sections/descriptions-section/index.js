import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";

import TextEditor from "~/components/ui-components/text-editor";
import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import PlainList from "~/components/ui-components/list-components/plain-list";

import {addInfo, selectDeveloperInfo} from "~/store/reducers/developer";
import {selectIndex, selectToken} from "~/store/reducers/manager";
import {addMessage} from "~/store/reducers/messages";

import axios from "axios";

import stringUtils from 'utils/string.utils'

const DescriptionsSection = () => {
    const developerInfo = useSelector(selectDeveloperInfo)
    const token = useSelector(selectToken)
    const dispatch = useDispatch()
    const managerId = useSelector(selectIndex)

    const [isPending, setIsPending] = useState(false)

    const [descriptionsList, setDescriptionsList] = useState([])
    const [activeElement, setActiveElement] = useState(null)
    const [activeContent, setActiveContent] = useState('')

    useEffect(() => {
        const {descriptions} = developerInfo
        setDescriptionsList(descriptions || [])
    }, [developerInfo])

    useEffect(() => {
        if (activeElement !== null) {
            setActiveContent(descriptionsList[activeElement])
            return
        }
        setActiveContent('')
    }, [activeElement])

    const handlerAddElement = () => {
        setDescriptionsList(prevState => [...prevState, activeContent])
        setActiveContent('')
    }

    const handlerChangeElement = () => {
        setDescriptionsList(prevState => prevState.map((element, index) => {
            if (index === activeElement) {
                return activeContent
            }
            return element
        }))
        setActiveContent('')
        setActiveElement(null)
    }

    const handlerUpdateDeveloperInfo = async () => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateDeveloper`,
                {
                    id: developerInfo.id,
                    descriptions: descriptionsList
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(addInfo({
                descriptions: descriptionsList
            }))
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/add-action`, {
                content_manager_index: managerId,
                action_type: "update",
                section_name: "description",
                developer_index: developerInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: 'Застройщик обновлен',
                lifetime: 5
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

    return (
        <div className={'plain-container plain-row-container'}>
            <h1 className="header">Элементы описания</h1>
            <PlainList elements={descriptionsList.map(element => stringUtils.htmlToStingParser(element))} activeElement={activeElement}
                        selectEvent={(value) => setActiveElement(value)}/>
            <TextEditor value={activeContent} changeEvent={(value) => setActiveContent(value)}/>
            <div className={'plain-button plain-container plain-row-container'}>
                <PlainButton disabled={!activeContent || activeContent === '<p><br></p>'}
                             clickEvent={() => activeElement === null ? handlerAddElement() : handlerChangeElement()}>
                    {activeElement === null && 'Добавить'}
                    {activeElement !== null && 'Изменить'}
                </PlainButton>
                <PlainButton disabled={descriptionsList.length === 0} clickEvent={handlerUpdateDeveloperInfo}>Сохранить</PlainButton>
            </div>
            {isPending && <PlainLoader className={'plain-loader'}/>}
        </div>
    )
}

export default DescriptionsSection;