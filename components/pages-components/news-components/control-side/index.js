import useAxios from "~/hooks/use-axios.hook";
import {useState, useEffect} from "react";
import useDebounce from '~/hooks/use-debounce';
import {useDispatch, useSelector} from "react-redux";

import {selectToken} from "~/store/reducers/manager";
import {addMessage} from "~/store/reducers/messages";
import {setActiveNews, setListNews} from "~/store/reducers/news";
import {selectListNews, selectActiveNewsIndex} from "~/store/reducers/news";

import PlainLoader from "~/components/ui-components/plain-loader";
import MultipleList from "~/components/ui-components/list-components/multiple-list";
import TextInput from "~/components/ui-components/text-input";
import HorizontalLine from "~/components/general-components/horizontal-line";
import PlainButton from "~/components/ui-components/plain-button";
import PlainList from "~/components/ui-components/list-components/plain-list";

import axios from "axios";

const ControlSide = () => {
    const token = useSelector(selectToken);
    const dispatch = useDispatch();

    // новости найденные по фильтру
    const staticNews = useSelector(selectListNews);
    const activeNews = useSelector(selectActiveNewsIndex);

    // запрашиваю все регионы
    const [staticRegions, errorStaticRegions, isLoadStaticRegions] = useAxios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/region/`,
        method: 'get'
    })
    // запрашиваю все города
    const [staticCities, errorStaticCities, isLoadStaticCities] = useAxios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/city/`,
        method: 'get'
    })
    // запрашиваю всех застройщиков
    const [staticDevelopers, errorStaticDevelopers, isLoadStaticDevelopers] = useAxios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/developer/get-with-ordered-fields`,
        method: 'get'
    })
    // запрашиваю все ЖК
    const [staticComplexes, errorStaticComplexes, isLoadStaticComplexes] = useAxios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/complex/get-with-ordered-fields `,
        method: 'get',
        body: JSON.stringify({})
    })
    // запрашиваю все КП
    const [staticVillages, errorStaticVillages, isLoadStaticVillages] = useAxios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/village/get-with-ordered-fields`,
        method: 'get',
        body: JSON.stringify({})
    })

    useEffect(() => {console.log('is rerender');}, [])

    // состояния по активным данным
    const [activeRegions, setActiveRegions] = useState([])
    const [activeCities, setActiveCities] = useState([])
    const [activeDevelopers, setActiveDevelopers] = useState([])
    const [activeComplexes, setActiveComplexes] = useState([])
    const [activeVillages, setActiveVillages] = useState([])

    // состояния по поисковым словам
    const [findRegions, setFindRegions] = useState('')
    const [findCities, setFindCities] = useState('')
    const [findDevelopers, setFindDevelopers] = useState('')
    const [findComplexes, setFindComplexes] = useState('')
    const [findVillages, setFindVillages] = useState('')
    const [findNews, setFindNews] = useState('')

    // состояние отображения фильтра
    const [isShowFilter, setIsShowFilter] = useState(false)

    // состояния ожидания ответа от сервера
    const [isNewsPending, setIsNewsPending] = useState(false)

    // обработчик сборки фильтров для новостей
    const handlerCollectFilterData = () => {
        try {
            let result = {}
            if (activeRegions.length) {
                result = {...result, region_indexes: [...activeRegions]}
            }
            if (activeCities.length) {
                result = {...result, cities_indexes: [...activeCities]}
            }
            if (activeDevelopers.length) {
                result = {...result, developers_indexes: [...activeDevelopers]}
            }
            if (activeComplexes.length) {
                result = {...result, complexes_indexes: [...activeComplexes]}
            }
            if (activeVillages.length) {
                result = {...result, villages_indexes: [...activeVillages]}
            }
            return result
        } catch (e) {
            console.error(e)
            return {}
        }
    }

    // обработчик запроса новостей по фильтру
    const getFilterNews = async () => {
        try {
            setIsNewsPending(true)
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/news/find`,
                {
                    ...handlerCollectFilterData()
                }
            )
            dispatch(setListNews([...response.data]))
        } catch (e) {
            console.error(e)
        } finally {
            setIsNewsPending(false)
        }
    }

    // вызов запроса новостей через кастомный хук
    const debounceGetFilterNews = useDebounce(getFilterNews, 1000);

    useEffect(() => {
        debounceGetFilterNews()
    }, [activeRegions, activeCities, activeDevelopers, activeComplexes, activeVillages])

    // создание новости
    const createNews = async () => {
        try {
            setIsNewsPending(true)
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/news-manager/createNews`,
                {
                    header: 'New news',
                    url: `https://${process.env.NEXT_PUBLIC_SITE_URL}/news/New_news`
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(setListNews([...staticNews, response.data]))
            dispatch(addMessage({
                type: 'success',
                text: 'Новость создана'
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'ошибка при создании новости'
            }))
        } finally {
            setIsNewsPending(false)
        }
    }

    // удаление новости
    const deleteNews = async (index = 0) => {
        try {
            setIsNewsPending(true)
            await axios.delete(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/news-manager/deleteNews/${staticNews[index].id}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(setActiveNews(null))
            dispatch(setListNews([...staticNews.filter((element, id) => id !== index)]))
            dispatch(addMessage({
                type: 'success',
                text: 'Новость удалена'
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'ошибка при удалении новости'
            }))
        } finally {
            setIsNewsPending(false)
        }
    }

    if (!errorStaticRegions && !errorStaticDevelopers && !errorStaticCities && !errorStaticComplexes && !errorStaticVillages) {
        return (
            <div className={`plain-row-container`}>
                <span className="plain-text font-bold">Выбрать новости</span>
                {
                    isShowFilter
                    && <div className={`plain-row-container`}>
                        <div className={'plain-container'}>
                            {
                                Array.isArray(staticRegions)
                                && staticRegions.length > 0
                                && <div className={`plain-row-container`}>
                                    <TextInput label={'Поиск региона'} value={findRegions}
                                               changeValue={(value) => setFindRegions(value)}/>
                                    <MultipleList label={'Регионы'}
                                                  activeElements={activeRegions}
                                                  selectEvent={(value) => setActiveRegions(prevState => [...prevState, value])}
                                                  raiseEvent={(value) => setActiveRegions((prevState => prevState.filter(element => element !== value)))}
                                                  elements={staticRegions.map(element => {
                                                      return {text: element.name, index: element.id}
                                                  }).filter(element => element.text.includes(findRegions))}/>
                                </div>
                            }
                            {isLoadStaticRegions && <PlainLoader/>}
                        </div>
                        <div className={'plain-container'}>
                            {
                                Array.isArray(staticCities)
                                && staticCities.length > 0
                                && <div className={`plain-row-container`}>
                                    <TextInput label={'Поиск города'} value={findCities}
                                               changeValue={(value) => setFindCities(value)}/>
                                    <MultipleList label={'Города'}
                                                  activeElements={activeCities}
                                                  selectEvent={(value) => setActiveCities(prevState => [...prevState, value])}
                                                  raiseEvent={(value) => setActiveCities((prevState => prevState.filter(element => element !== value)))}
                                                  elements={staticCities.map(element => {
                                                      return {text: element.name, index: element.id}
                                                  }).filter(element => element.text.includes(findCities))}/>
                                </div>
                            }
                            {isLoadStaticCities && <PlainLoader/>}
                        </div>
                        <div className={'plain-container'}>
                            {
                                Array.isArray(staticDevelopers)
                                && staticDevelopers.length > 0
                                && <div className={`plain-row-container`}>
                                    <TextInput label={'Поиск застройщика'} value={findDevelopers}
                                               changeValue={(value) => setFindDevelopers(value)}/>
                                    <MultipleList label={'Застройщики'}
                                                  activeElements={activeDevelopers}
                                                  selectEvent={(value) => setActiveDevelopers(prevState => [...prevState, value])}
                                                  raiseEvent={(value) => setActiveDevelopers((prevState => prevState.filter(element => element !== value)))}
                                                  elements={staticDevelopers.map(element => {
                                                      return {text: element.name, index: element.id}
                                                  }).filter(element => element.text.includes(findDevelopers))}/>
                                </div>
                            }
                            {isLoadStaticDevelopers && <PlainLoader/>}
                        </div>
                        <div className={'plain-container'}>
                            {
                                Array.isArray(staticComplexes)
                                && staticComplexes.length > 0
                                && <div className={`plain-row-container`}>
                                    <TextInput label={'Поиск ЖК'} value={findComplexes}
                                               changeValue={(value) => setFindComplexes(value)}/>
                                    <MultipleList label={'Жилые комплексы'}
                                                  activeElements={activeComplexes}
                                                  selectEvent={(value) => setActiveComplexes(prevState => [...prevState, value])}
                                                  raiseEvent={(value) => setActiveComplexes((prevState => prevState.filter(element => element !== value)))}
                                                  elements={staticComplexes.map(element => {
                                                      return {text: element.name, index: element.id}
                                                  }).filter(element => element.text.includes(findComplexes))}/>
                                </div>
                            }
                            {isLoadStaticComplexes && <PlainLoader/>}
                        </div>
                        <div className={'plain-container'}>
                            {
                                Array.isArray(staticVillages)
                                && staticVillages.length > 0
                                && <div className={`plain-row-container`}>
                                    <TextInput label={'Поиск КП'} value={findVillages}
                                               changeValue={(value) => setFindVillages(value)}/>
                                    <MultipleList label={'Коттеджные поселки'}
                                                  activeElements={activeVillages}
                                                  selectEvent={(value) => setActiveVillages(prevState => [...prevState, value])}
                                                  raiseEvent={(value) => setActiveVillages((prevState => prevState.filter(element => element !== value)))}
                                                  elements={staticVillages.map(element => {
                                                      return {text: element.name, index: element.id}
                                                  }).filter(element => element.text.includes(findVillages))}/>
                                </div>
                            }
                            {isLoadStaticVillages && <PlainLoader/>}
                        </div>
                    </div>
                }
                <PlainButton clickEvent={() => setIsShowFilter(prevState => !prevState)}>
                    <span className={`plain-text font-medium`}>
                        {isShowFilter && 'Скрыть фильтр'}
                        {!isShowFilter && 'Показать фильтр'}
                    </span>
                </PlainButton>
                <HorizontalLine/>
                <div className="plain-container plain-row-container">
                    <TextInput label={'Поиск по заголовку'} value={findNews}
                               changeValue={(value) => setFindNews(value)}/>
                    <PlainList label={'Новости'}
                                elements={(Array.isArray(staticNews) && staticNews.length > 0) ? staticNews.map(element => element.header).filter(element => String(element).includes(findNews)) : []}
                                activeElement={activeNews} selectEvent={(value) => dispatch(setActiveNews(value))} isDeleted={true} deleteEvent={deleteNews}/>
                    <PlainButton clickEvent={createNews}>Добавить новость</PlainButton>
                    {isNewsPending && <PlainLoader className={`plain-loader`}/>}
                </div>
            </div>
        )
    }
    return <span className={'plain-text'}>Произошла ошибка при загрузке данных, попробуйте позже</span>
}

export default ControlSide;