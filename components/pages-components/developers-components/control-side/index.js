import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";

import {selectAllowedRegions, selectAllowedCities, selectToken, selectIndex} from "~/store/reducers/manager";
import {addMessage} from "~/store/reducers/messages";
import {addInfo, clearInfo} from "~/store/reducers/developer";

import PlainLoader from "~/components/ui-components/plain-loader";
import MultipleList from "~/components/ui-components/list-components/multiple-list";
import PlainButton from "~/components/ui-components/plain-button";
import TextInput from "~/components/ui-components/text-input";
import axios from "axios";
import SingleList from "~/components/ui-components/list-components/single-list";

const ControlSide = () => {
    const regionsAccess = useSelector(selectAllowedRegions)
    const citiesAccess = useSelector(selectAllowedCities)
    const token = useSelector(selectToken)
    const managerId = useSelector(selectIndex)
    const dispatch = useDispatch()

    const [regions, setRegions] = useState([])
    const [cities, setCities] = useState([])
    const [developerList, setDeveloperList] = useState([])
    const [isPendingDevelopers, setIsPendingDevelopers] = useState(false)

    const [activeDeveloper, setActiveDeveloper] = useState(null)
    const [selectRegions, setSelectRegions] = useState([])
    const [selectCities, setSelectCities] = useState([])

    const [filterRegions, setFilterRegions] = useState('');
    const [filterCities, setFilterCities] = useState('');
    const [filterDevelopers, setFilterDevelopers] = useState('');

    const [isPending, setIsPending] = useState(false)

    /**
     * Обработчик получения списка регионов в зависимости о разрешенных регионов
     * @returns {Promise<void>}
     */
    const handlerGetRegions = async () => {
        try {
            if (!regionsAccess.length) {
                return;
            }
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/region/filter`,
                {
                    id: [...regionsAccess]
                }
            )
            setRegions(response.data.map(element => ({
                text: element.name,
                index: element.id
            })))
            dispatch(addMessage({
                type: 'success',
                text: `Регионы получены`
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: `Ошибка при получении регионов`
            }))
        }
    }

    /**
     * Обработчик получения списка городов в зависимости о разрешенных городов
     * @returns {Promise<void>}
     */
    const handlerGetCities = async () => {
        try {
            if (!citiesAccess.length) {
                return;
            }
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/city/filter`,
                {
                    id: [...citiesAccess]
                }
            )
            setCities(response.data.map(element => ({
                text: element.name,
                index: element.id,
                ...element
            })))
            dispatch(addMessage({
                type: 'success',
                text: `Города получены`
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: `Ошибка при получении городов`
            }))
        }
    }

    /**
     * Обработчик получения списка застройщиков в зависимости о разрешенных застройщиков
     * @returns {Promise<void>}
     */
    const handlerGetDevelopers = async () => {
        try {
            if (!regionsAccess.length || !citiesAccess.length) {
                return;
            }
            setIsPendingDevelopers(true)
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/developer/filter`,
                {
                    region_indexes: [...regionsAccess],
                    cities_indexes: [...citiesAccess]
                }
            )
            setDeveloperList([...response.data])
            dispatch(addMessage({
                type: 'success',
                text: `Застройщики получены`
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: `Ошибка при получении застройщиков`
            }))
        } finally {
            setIsPendingDevelopers(false)
        }
    }

    /**
     * Обработчик создания застройщика
     * @returns {Promise<void>}
     */
    const handlerCreateDeveloper = async () => {
        try {
            setIsPending(true)
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/createDeveloper`,
                {
                    name: 'New developer',
                    region_indexes: [...selectRegions],
                    cities_indexes: [...selectCities]
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            setDeveloperList(prevState => [...prevState, response.data]);
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/add-action`, {
                content_manager_index: managerId,
                action_type: "create",
                developer_index: response.data.id
            });
            dispatch(addMessage({
                type: 'success',
                text: `Застройщик создан`
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: `Ошибка при создании застройщика`
            }))
        } finally {
            setIsPending(false)
        }
    }

    /**
     * Обработчик удаления
     * @returns {Promise<void>}
     */
    const handlerDeleteDeveloper = async (value) => {
        try {
            setIsPendingDevelopers(true)
            await axios.delete(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/deleteDeveloper/${value}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            setDeveloperList(prevState => prevState.filter(element => element.id !== value))
            dispatch(addMessage({
                type: 'success',
                text: `Застройщик удален`
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: `Ошибка при удалении застройщика`
            }))
        } finally {
            setIsPendingDevelopers(false)
        }
    }

    /**
     * Наблюдатель запроса регионов
     */
    useEffect(() => {
        if (regionsAccess.length > 0) {
            handlerGetRegions()
        }
    }, [regionsAccess])

    /**
     * Наблюдатель запроса городов
     */
    useEffect(() => {
        if (citiesAccess.length > 0) {
            handlerGetCities()
        }
    }, [citiesAccess])

    /**
     * Наблюдатель запроса застройщиков
     */
    useEffect(() => {
        if (regionsAccess.length > 0 && citiesAccess.length > 0) {
            handlerGetDevelopers()
        }
    }, [regionsAccess, citiesAccess])

    /**
     * Наблюдатель выбора застройщика
     */
    useEffect(() => {
        if (activeDeveloper !== null && Array.isArray(developerList)) {
            const developer = developerList.find(element => element.id === activeDeveloper)
            dispatch(clearInfo())
            dispatch(addInfo({
                ...developer
            }))
            dispatch(addMessage({
                type: 'info',
                text: `Выбран застройщик ${developer.name}`
            }))
        }
    }, [activeDeveloper])

    /**
     * Обработчик формирования фильтрованного списка элементов в зависимости от значениея фильтра и выбранных елементов
     * @param propList
     * @param filterValue
     * @param selectedList
     * @returns {*[]}
     */
    const handlerFilteredList = (propList = [], filterValue = '', selectedList = []) => {
        try {
            let resultList = [];
            for (const {text, index, ...fields} of propList) {
                if (text.includes(filterValue) || selectedList.findIndex(element => element === index) !== -1) {
                    resultList = [...resultList, {text, index, ...fields}]
                }
            }
            return resultList;
        } catch (e) {
            console.error(e);
            return []
        }
    }

    /**
     * Фильтрованный список городов в зависимости от выбранного региона
     * @returns {*[]}
     */
    const validCities = (citiesList = []) => {
        if (selectRegions.length > 0) {
            let resultList = citiesList.filter(city => selectRegions.findIndex(region => Number(region) === Number(city.region_index)) !== -1);
            return resultList;
        }
        return citiesList;
    }

    return (
        <div className='row plain-row-container'>
            <div className='plain-container'>
                {
                    Array.isArray(developerList) &&
                    <div className={'plain-row-container'}>
                        <TextInput value={filterDevelopers} changeValue={(value) => setFilterDevelopers(value)} label={'Поиск'}/>
                        <SingleList
                            label={'Выбрать застройщика'}
                            elements={developerList.map(element => ({text: element.name, index: element.id})).filter(element => element.text.includes(filterDevelopers))}
                            activeElement={activeDeveloper}
                            selectEvent={(value) => setActiveDeveloper(value)}
                            deleteEvent={handlerDeleteDeveloper}
                            isDeleted={true}
                        />
                    </div>
                }
                {isPendingDevelopers && <PlainLoader className='plain-loader'/>}
            </div>
            <div className='plain-container plain-row-container'>
                <span className='plain-text font-bold'>Создание застройщика</span>
                {
                    Array.isArray(regions)  &&
                    <div className={'plain-row-container'}>
                        <TextInput label={'Поиск регионов'} value={filterRegions} changeValue={(value) => setFilterRegions(value)}/>
                        <MultipleList
                            label={'Регион (выбрать нужное)'}
                            activeElements={selectRegions}
                            elements={handlerFilteredList(regions, filterRegions, selectRegions)}
                            selectEvent={(value) => setSelectRegions(prevState => [...prevState, value])}
                            raiseEvent={(value) => setSelectRegions(prevState => prevState.filter(element => element !== value))}/>
                    </div>
                }
                {
                    Array.isArray(cities)  &&
                    <div className={'plain-row-container'}>
                        <TextInput label={'Поиск городов'} value={filterCities} changeValue={(value) => setFilterCities(value)}/>
                        <MultipleList
                            label={'Город (выбрать нужное)'}
                            activeElements={selectCities}
                            elements={validCities(handlerFilteredList(cities, filterCities, selectCities))}
                            selectEvent={(value) => setSelectCities(prevState => [...prevState, value])}
                            raiseEvent={(value) => setSelectCities(prevState => prevState.filter(element => element !== value))}/>
                    </div>
                }
                <PlainButton disabled={!selectCities.length || !selectRegions.length} clickEvent={handlerCreateDeveloper}><span className='plain-text font-medium'>Создать застройщика</span></PlainButton>
                {isPending && <PlainLoader className='plain-loader'/>}
            </div>
        </div>
    )
}

export default ControlSide;