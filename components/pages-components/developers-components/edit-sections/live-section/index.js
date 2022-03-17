import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";

import TextInput from "~/components/ui-components/text-input";
import NumberInput from "~/components/ui-components/number-input";
import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";

import {addInfo, selectDeveloperInfo} from "~/store/reducers/developer";
import {selectToken} from "~/store/reducers/manager";
import {addMessage} from "~/store/reducers/messages";

import axios from "axios";

const LiveSection = () => {
    const developerInfo = useSelector(selectDeveloperInfo)
    const token = useSelector(selectToken)
    const dispatch = useDispatch()

    const [isPending, setIsPending] = useState(false)

    const [classDevelop, setClassDevelop] = useState('')
    const [decoration, setDecoration] = useState('')
    const [minSquare, setMinSquare] = useState(0)
    const [maxSquare, setMaxSquare] = useState(0)

    useEffect(() => {
        const {type_class, square_min, square_max, decoration} = developerInfo
        setClassDevelop(type_class || '')
        setDecoration(decoration || '')
        setMinSquare(square_min || 0)
        setMaxSquare(square_max || 0)
    }, [developerInfo])

    const handlerUpdateDeveloper = async () => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateDeveloper`,
                {
                    id: developerInfo.id,
                    type_class: classDevelop,
                    decoration,
                    square_min: minSquare,
                    square_max: maxSquare
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(addMessage({
                type: 'success',
                text: 'Застройщик обновлен',
                lifetime: 5
            }))
            dispatch(addInfo({
                type_class: classDevelop,
                decoration,
                square_min: minSquare,
                square_max: maxSquare
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
    return(
        <div className="plain-container plain-row-container">
            <h1 className="header">Про жилье</h1>
            <div className="plain-column-container">
                <TextInput label={'Класс жилья'} value={classDevelop} changeValue={(value) => setClassDevelop(value)}/>
                <TextInput label={'Тип отделки'} value={decoration} changeValue={(value) => setDecoration(value)}/>
                <NumberInput label={'Мин. площадь жилья'} value={minSquare} changeValue={(value) => setMinSquare(value)}/>
                <NumberInput label={'Макс. площадь жилья'} value={maxSquare} changeValue={(value) => setMaxSquare(value)}/>
            </div>
            <div className='plain-button'>
                <PlainButton clickEvent={handlerUpdateDeveloper} disabled={!classDevelop || !decoration || !minSquare || !maxSquare}>Сохранить</PlainButton>
            </div>
            {isPending && <PlainLoader className='plain-loader'/>}
        </div>
    )
}

export default LiveSection;