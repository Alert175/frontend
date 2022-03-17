import MultipleList from "~/components/ui-components/list-components/multiple-list";
import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import TextInput from "~/components/ui-components/text-input";

import {useState, useEffect} from "react";

import axios from 'axios';

import {list} from './advantagesList'
import {useDispatch, useSelector} from "react-redux";
import {addInfo, selectComplexInfo} from "~/store/reducers/complex";
import {selectIndex, selectToken} from "~/store/reducers/manager";

import classes from './advantages-setion.module.scss'
import {addMessage} from "~/store/reducers/messages";

const ConsumerQualities = () => {
    const [searchWord, setSearchWord] = useState('')
    const [advantagesList, setAdvantagesList] = useState(list.map((element, index) => ({text: element.text, weight: element.weight, index})))
    const [selectedElements, setSelectedElements] = useState([])
    const [isPending, setIsPending] = useState(false)

    const complexInfo = useSelector(selectComplexInfo)
    const token = useSelector(selectToken)
    const managerId = useSelector(selectIndex)
    const dispatch = useDispatch()

    useEffect(() => {
        const {pluses} = complexInfo
        if (pluses && pluses.length > 0) {
            for (const [index, localAdvantage] of list.entries()) {
                if (pluses.includes(localAdvantage.text)) {
                    setSelectedElements(prevState => [...prevState, index])
                }
            }
        }
    }, [complexInfo])

    const collectFields = () => {
        try {
            let advantages = []
            let disAdvantages = []
            let rating = 0
            for (const {text, weight, index} of advantagesList) {
                if (selectedElements.findIndex(elementId => elementId === index) !== -1) {
                    advantages = [...advantages, text]
                    rating += Number(weight)
                } else {
                    disAdvantages = [...disAdvantages, text]
                }
            }
            return {advantages, disAdvantages, rating}
        } catch (e) {
            console.error(e)
        }
    }

    const handlerUpdateAdvantagesComplex = async () => {
        try {
            const {advantages, disAdvantages, rating} = collectFields()
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateComplex`,
                {
                    id: complexInfo.id,
                    pluses: advantages,
                    minuses: disAdvantages,
                    rating_counter: rating
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
                section_name: "qualities",
                complex_index: complexInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: 'Данные успешно обновлены',
                lifetime: 5
            }))
            dispatch(addInfo({advantages, disAdvantages, rating}))
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
        <div className={`${classes.advantagesSectionContainer} row`}>
            <h1 className='header'>Плюсы ЖК</h1>
            <TextInput value={searchWord} changeValue={(value) => setSearchWord(value)} label={'Поиск по названию'}
                       holder={'Введите преимущество'}/>
            <MultipleList
                elements={advantagesList.filter(element => element.text.includes(searchWord))}
                styleConfig={{
                    height: '508px',
                    maxHeight: '508px'
                }}
                label={'Выбрать нужное'}
                activeElements={selectedElements}
                selectEvent={(value) => setSelectedElements(prevState => [...prevState, value])}
                raiseEvent={(value) => setSelectedElements(selectedElements.filter(element => Number(element) !== Number(value)))}
                style={{border: selectedElements.length < 0 ? '1px solid red' : '1px solid black'}}
            />
            <PlainButton disabled={selectedElements.length === 0} styleConfig={{width: '360px'}}
                         clickEvent={handlerUpdateAdvantagesComplex}>
                <span className='plain-text font-medium'>Сохранить</span>
            </PlainButton>
            {isPending && <PlainLoader/>}
        </div>
    )
}

export default ConsumerQualities;