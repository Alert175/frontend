import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import useAxios from "~/hooks/use-axios.hook";

import MultipleList from "~/components/ui-components/list-components/multiple-list";
import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import TextInput from "~/components/ui-components/text-input";

import {addInfo, selectDeveloperInfo} from "~/store/reducers/developer";
import {selectAllowedCities, selectAllowedRegions, selectIndex} from "~/store/reducers/manager";
import {selectToken} from "~/store/reducers/manager";
import {addMessage} from "~/store/reducers/messages";

import axios from "axios";

const ConfigSection = () => {
    const dispatch = useDispatch()

    const developerInfo = useSelector(selectDeveloperInfo)
    const token = useSelector(selectToken)
    const managerId = useSelector(selectIndex)
    // разрешенные регионы / города для менеджера
    const allowRegions = useSelector(selectAllowedRegions)
    const allowCities = useSelector(selectAllowedCities)

    const [isPending, setIsPending] = useState(false)

    // регионы / города застройщика
    const [developerRegions, setDeveloperRegions] = useState([])
    const [developerCities, setDeveloperCities] = useState([])

    // регионы и города из БД
    const [staticRegions, errorRegions, isLoadRegions] = useAxios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/region/filter`,
        method: 'post',
        body: JSON.stringify({
            id: [...allowRegions]
        })
    })
    const [staticCities, errorCities, isLoadCities] = useAxios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/city/filter`,
        method: 'post',
        body: JSON.stringify({
            id: [...allowCities]
        })
    })

    const [validRegions, setValidRegions] = useState([])
    const [validCities, setValidCities] = useState([])

    const [filterRegions, setFilterRegions] = useState('')
    const [filterCities, setFilterCities] = useState('')

    // перегружаю регионы / города застройщика
    useEffect(() => {
        const {region_indexes, cities_indexes} = developerInfo
        setDeveloperRegions(region_indexes || [])
        setDeveloperCities(cities_indexes || [])
    }, [developerInfo])

    // отслеживаю изменения статичных регионов / городов и объединяю список разрешенных городов/регионов с их названиями
    useEffect(() => {
        if (Array.isArray(staticRegions) && staticRegions.length > 0) {
            setValidRegions(combineData(allowRegions, staticRegions))
        }
        if (Array.isArray(staticCities) && staticCities.length > 0) {
            setValidCities(combineData(allowCities, staticCities))
        }
    }, [staticRegions, staticCities])

    // обработчик который соберет регионы/города в нужном формате
    const combineData = (originalList = [], verifyList = []) => {
        try {
            let result = []
            for (const originalElement of originalList) {
                for (const verifyElement of verifyList) {
                    if (Number(originalElement) === Number(verifyElement.id) && 'name' in verifyElement) {
                        result = [...result, {
                            index: Number(originalElement),
                            text: verifyElement.name
                        }]
                    }
                }
            }
            return result
        } catch (e) {
            console.error(e)
            return []
        }
    }

    // обработчик обновления застройщика
    const handlerUpdateDeveloperInfo = async () => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateDeveloper`,
                {
                    id: developerInfo.id,
                    region_indexes: developerRegions,
                    cities_indexes: developerCities
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
                region_indexes: developerRegions,
                cities_indexes: developerCities
            }));
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/add-action`, {
                content_manager_index: managerId,
                action_type: "update",
                section_name: "config",
                developer_index: developerInfo.id
            });
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

    if (isLoadRegions || isLoadCities) {
        return <PlainLoader/>
    }

    if (!errorRegions && !errorCities) {
        return (
            <div className={`plain-row-container plain-container`}>
                <h1 className="header">Настройка мест разработки</h1>
                {(isLoadRegions || isLoadCities) && <PlainLoader/>}
                <div className={`plain-column-container`}>
                    <div className={'plain-row-container'}>
                        <TextInput value={filterRegions} changeValue={(value) => setFilterRegions(value)} label={'Поиск региона'}/>
                        <MultipleList label={'Регионы'} elements={validRegions.filter(element => element.text.includes(filterRegions))} activeElements={developerRegions}
                                      selectEvent={(value) => setDeveloperRegions(prevState => [...prevState, value])}
                                      raiseEvent={(value) => setDeveloperRegions(prevState => prevState.filter(element => element !== value))}
                                      style={{border: developerRegions.length === 0 ? '1px solid red' : '1px solid black'}}/>
                    </div>
                    <div className={'plain-row-container'}>
                        <TextInput value={filterCities} changeValue={(value) => setFilterCities(value)} label={'Поиск города'}/>
                        <MultipleList label={'Города'} elements={validCities.filter(element => element.text.includes(filterCities))} activeElements={developerCities}
                                      selectEvent={(value) => setDeveloperCities(prevState => [...prevState, value])}
                                      raiseEvent={(value) => setDeveloperCities(prevState => prevState.filter(element => element !== value))}
                                      style={{border: developerCities.length === 0 ? '1px solid red' : '1px solid black'}}/>
                    </div>
                </div>
                <div className={`plain-button`}>
                    <PlainButton disabled={developerRegions.length === 0 || developerCities.length === 0} clickEvent={handlerUpdateDeveloperInfo}>Сохранить</PlainButton>
                </div>
                {isPending && <PlainLoader className={'plain-loader'}/>}
            </div>
        )
    }

    return null
}

export default ConfigSection;