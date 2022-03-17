import classes from './control-side.module.scss'
import PlusImage from 'public/Images/PagesImages/Complex/ControlPanel/plus.svg'

import {useSelector, useDispatch} from "react-redux";
import {selectAllowedRegions, selectAllowedCities, selectToken, selectIndex} from "~/store/reducers/manager";
import {
    addInfo,
    setListVillages,
    setActiveVillages,
    selectListVillages,
    selectActiveVillageIndex
} from "~/store/reducers/village";
import {addMessage} from "~/store/reducers/messages";

import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import TextInput from "~/components/ui-components/text-input";
import SingleList from "~/components/ui-components/list-components/single-list";

import {useEffect, useState} from "react";
import axios from 'axios'

const ControlSide = () => {
    const regionsIndexes = useSelector(selectAllowedRegions)
    const citiesIndexes = useSelector(selectAllowedCities)
    const activeComplex = useSelector(selectActiveVillageIndex)
    const villagesList = useSelector(selectListVillages)
    const token = useSelector(selectToken)
    const managerId = useSelector(selectIndex)

    const dispatch = useDispatch()

    const [isPendingRegions, setIsPendingRegions] = useState(false)
    const [isPendingCities, setIsPendingCities] = useState(false)
    const [isPendingDevelopers, setIsPendingDevelopers] = useState(false)
    const [isPendingComplexes, setIsPendingComplexes] = useState(false)
    const [showWarning, setShowWarning] = useState(true)

    const [regions, setRegions] = useState([])
    const [cities, setCities] = useState([])
    const [developers, setDevelopers] = useState([])

    const [activeRegion, setActiveRegion] = useState(null)
    const [activeCity, setActiveCity] = useState(null)
    const [activeDeveloper, setActiveDeveloper] = useState(null)

    const [filterRegions, setFilterRegions] = useState('')
    const [filterCities, setFilterCities] = useState('')
    const [filterDevelopers, setFilterDevelopers] = useState('')
    const [filterVillages, setFilterComplexes] = useState('')

    useEffect(() => {
        setCities([])
        setActiveCity(null)
        setDevelopers([])
        setActiveDeveloper(null)
        dispatch(setListVillages([]))
        dispatch(setActiveVillages(null))
        if (regionsIndexes.length > 0) {
            getRegions()
        }
    }, [regionsIndexes])

    const getRegions = async () => {
        try {
            setIsPendingRegions(true)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/region/filter`, {
                id: regionsIndexes
            })
            if (response.data.length === 0) {
                throw new Error('not found region-filter')
            }
            setRegions(response.data)
            dispatch(addMessage({
                type: 'success',
                text: 'Регионы получены',
                lifetime: 5
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'Не удалось загрузить регионы',
                lifetime: 5
            }))
        } finally {
            setIsPendingRegions(false)
        }
    }

    useEffect(() => {
        setActiveCity(null)
        setCities([])
        setDevelopers([])
        setActiveDeveloper(null)
        dispatch(setListVillages([]))
        dispatch(setActiveVillages(null))
        if (activeRegion !== null) {
            getCities()
        }
    }, [activeRegion])

    const validateCities = (fetchCities = []) => {
        let result = []
        for (const city of fetchCities) {
            for (const index of citiesIndexes) {
                if (Number(city.id) === Number(index)) {
                    result = [...result, city]
                }
            }
        }
        return result
    }

    const getCities = async () => {
        try {
            setIsPendingCities(true)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/city/filter`, {
                region_index: activeRegion
            })
            if (response.data.length === 0) {
                new Error('not found cities')
            }
            setCities(validateCities(response.data))
            dispatch(addMessage({
                type: 'success',
                text: 'Города получены',
                lifetime: 5
            }))
        } catch (e) {
            console.error(e)
            setCities([])
            dispatch(addMessage({
                type: 'error',
                text: 'Не удалось загрузить города',
                lifetime: 5
            }))
        } finally {
            setIsPendingCities(false)
        }
    }

    useEffect(() => {
        setDevelopers([])
        setActiveDeveloper(null)
        dispatch(setListVillages([]))
        dispatch(setActiveVillages(null))
        if (activeCity !== null) {
            getDevelopers()
        }
    }, [activeCity])

    const getDevelopers = async () => {
        try {
            setIsPendingDevelopers(true)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/developer/filter`, {
                region_indexes: [activeRegion],
                cities_indexes: [activeCity]
            })
            if (response.data.length === 0) {
                new Error('not found cities')
            }
            setDevelopers(response.data)
            dispatch(setListVillages([]))
            dispatch(setActiveVillages(null))
            dispatch(addMessage({
                type: 'success',
                text: 'Застройщики получены',
                lifetime: 5
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'Не удалось загрузить застройщиков',
                lifetime: 5
            }))
        } finally {
            setIsPendingDevelopers(false)
        }
    }

    useEffect(() => {
        dispatch(setListVillages([]))
        dispatch(setActiveVillages(null))
        if (activeDeveloper !== null) {
            getVillages()
        }
    }, [activeDeveloper])

    const getVillages = async () => {
        try {
            setIsPendingComplexes(true)
            dispatch(setListVillages([]))
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/village/find`, {
                region_index: activeRegion,
                city_index: activeCity,
                developer_index: activeDeveloper
            })
            if (response.data.length === 0) {
                new Error('not found villages')
            }
            const regionElement = regions.find(element => element.id === activeRegion);
            const cityElement = cities.find(element => element.id === activeCity);
            const developerElement = developers.find(element => element.id === activeDeveloper);
            if (!regionElement || !cityElement || !developerElement) {
                new Error('regionName or cityName or developerName not valid');
            }
            dispatch(setListVillages(response.data.map(element => ({
                ...element,
                regionName: regionElement.name,
                cityName: cityElement.name,
                developerName: developerElement.name
            }))));
            dispatch(addMessage({
                type: 'success',
                text: 'КП получены',
                lifetime: 5
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'Не удалось загрузить КП',
                lifetime: 5
            }))
        } finally {
            setIsPendingComplexes(false)
        }
    }

    const handlerSelectVillage = (index) => {
        const activeVillageIndex = villagesList.findIndex(element => element.id === index)
        if (activeVillageIndex === null || activeVillageIndex === -1) {
            dispatch(setActiveVillages(null));
            return;
        }

        dispatch(setActiveVillages(activeVillageIndex));
        dispatch(addInfo({...villagesList[activeVillageIndex]}));
        dispatch(addMessage({
            type: 'info',
            text: `Выбран КП ${villagesList[activeVillageIndex].name}`,
            lifetime: 5
        }));
    }

    const handlerDeleteVillage = async (index = Number()) => {
        try {
            const activeVillageIndex = villagesList.findIndex(element => element.id === index)
            if (showWarning) {
                dispatch(addMessage({
                    type: 'error',
                    text: `Вы уверены, что хотите удалить КП ${villagesList[activeVillageIndex].name}`,
                    lifetime: 5
                }))
                setShowWarning(false)
                return
            }
            setIsPendingComplexes(true)
            await axios.delete(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/deleteVillage/${index}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(setActiveVillages(null));
            dispatch(addMessage({
                type: 'success',
                text: `КП успешно удален`,
                lifetime: 5
            }))
            await getVillages()
            setShowWarning(true)
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: `Ошибка при удалении КП`,
                lifetime: 5
            }))
        } finally {
            setIsPendingComplexes(false)
        }
    }

    const handlerCreateVillage = async () => {
        try {
            setIsPendingComplexes(true)
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/createVillage`,
                {
                    "name": "New Village",
                    "region_index": activeRegion,
                    "city_index": activeCity,
                    "developer_index": activeDeveloper
                },
                {
                    headers: {
                        Authorization: token
                    }
                });
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/add-action`, {
                content_manager_index: managerId,
                action_type: "create",
                village_index: response.data.id
            });
            dispatch(addMessage({
                type: 'success',
                text: `Новый КП создан`,
                lifetime: 5
            }))
            handlerSelectVillage(null)
            await getVillages()
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: `Ошибка при создании КП`,
                lifetime: 5
            }))
        } finally {
            setIsPendingComplexes(false)
        }
    }

    /**
     * наблюдатели по изменению фильтров, для корректного сброса значений
     */
    useEffect(() => {
        setFilterComplexes('')
        setFilterDevelopers('')
        setFilterCities('')
        dispatch(setActiveVillages(null));
        setActiveDeveloper(null)
        setActiveCity(null)
    }, [filterRegions])

    useEffect(() => {
        setFilterComplexes('')
        setFilterDevelopers('')
        dispatch(setActiveVillages(null));
        setActiveDeveloper(null)
    }, [filterCities])

    useEffect(() => {
        setFilterComplexes('')
        dispatch(setActiveVillages(null));
    }, [filterDevelopers])

    return (
        <div className={classes.sideContainer}>
            <div className={classes.selectContainer}>
                <TextInput value={filterRegions} changeValue={(value) => setFilterRegions(value)}
                           label={'Фильтр регионов'} isDisabled={regions.length === 0}/>
                <SingleList
                    elements={regions.map(element => ({text: element.name, index: element.id})).filter(element => element.text.includes(filterRegions))}
                    activeElement={activeRegion}
                    selectEvent={(value) => setActiveRegion(value)}
                    label={'Регионы (выбрать нужное)'}
                    isDisabled={regions.length === 0}
                />
                {isPendingRegions && <PlainLoader className={classes.selectLoader}/>}
            </div>
            <div className={classes.selectContainer}>
                <TextInput value={filterCities} changeValue={(value) => setFilterCities(value)}
                           label={'Фильтр городов'} isDisabled={cities.length === 0}/>
                <SingleList
                    elements={cities.map(element => ({text: element.name, index: element.id})).filter(element => element.text.includes(filterCities))}
                    activeElement={activeCity}
                    selectEvent={(value) => setActiveCity(value)}
                    label={'Города (выбрать нужное)'}
                    isDisabled={cities.length === 0}
                />
                {isPendingCities && <PlainLoader className={classes.selectLoader}/>}
            </div>
            <div className={classes.selectContainer}>
                <TextInput value={filterDevelopers} changeValue={(value) => setFilterDevelopers(value)}
                           label={'Фильтр застройщиков'} isDisabled={developers.length === 0}/>
                <SingleList
                    elements={developers.map(element => ({text: element.name, index: element.id})).filter(element => element.text.includes(filterDevelopers))}
                    activeElement={activeDeveloper}
                    selectEvent={(value) => setActiveDeveloper(value)}
                    label={'Застройщики (выбрать нужное)'}
                    isDisabled={developers.length === 0}
                />
                {isPendingDevelopers && <PlainLoader className={classes.selectLoader}/>}
            </div>
            <div className={classes.selectContainer}>
                <TextInput value={filterVillages} changeValue={(value) => setFilterComplexes(value)}
                           label={'Фильтр КП'} isDisabled={villagesList.length === 0}/>
                <SingleList
                    elements={villagesList.map(element => ({text: element.name, index: element.id})).filter(element => element.text.includes(filterVillages))}
                    activeElement={activeComplex !== null ? villagesList[activeComplex].id : null}
                    selectEvent={(value) => handlerSelectVillage(value)}
                    deleteEvent={(value) => handlerDeleteVillage(value)}
                    label={'ЖК (Выбрать нужное)'}
                    isDisabled={villagesList.length === 0}
                    isDeleted={true}
                />
                <PlainButton
                    disabled={isPendingComplexes || activeRegion === null || activeCity === null || activeDeveloper === null}
                    clickEvent={handlerCreateVillage}>
                    <span className='plain-text font-medium column center-items' style={{gap: '10px'}}>
                        Создать КП <PlusImage/>
                    </span>
                </PlainButton>
                {isPendingComplexes && <PlainLoader className={classes.selectLoader}/>}
            </div>
        </div>
    )
}

export default ControlSide;