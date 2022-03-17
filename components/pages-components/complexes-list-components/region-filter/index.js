import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {selectAllowedRegions} from '~/store/reducers/manager';
import axios from 'axios';
import {addMessage} from '~/store/reducers/messages';
import classes from '~/styles/pages-styles/complex.module.scss';
import TextInput from '~/components/ui-components/text-input';
import SingleList from '~/components/ui-components/list-components/single-list';
import PlainLoader from '~/components/ui-components/plain-loader';
import {selectActiveRegion, selectAllRegions, setActiveRegion, setAllRegions} from '~/store/reducers/complexes-list';
import {setListComplexes} from '~/store/reducers/complex';

const RegionFilter = () => {

    const dispatch = useDispatch()

    const [filterRegions, setFilterRegions] = useState('')
    const [isPendingRegions, setIsPendingRegions] = useState(false)

    const regionsIndexes = useSelector(selectAllowedRegions)

    const regions = useSelector(selectAllRegions)


    useEffect(() => {
        console.log(regions)
    }, [regions])

    const getRegions = async () => {
        try {
            setIsPendingRegions(true)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/region/filter`, {
                id: regionsIndexes
            })

            if (response.data.length === 0) {
                throw new Error('not found region-filter')
            }

            const payload = response.data
            dispatch(setAllRegions(payload))


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


    const getComplexes = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/complex/find`, {
                region_index: activeRegion
            })

            if (response.data.length === 0) {
                new Error('not found complexes')
            }
            const regionElement = regions.find(element => element.id === activeRegion);

            if (!regionElement) {
                new Error('regionName  not valid');
            }

            dispatch(setListComplexes(response.data.map(element => ({
                ...element,
                regionName: regionElement.name,
            }))));

            dispatch(addMessage({
                type: 'success',
                text: 'ЖК получены',
                lifetime: 5
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'Не удалось загрузить ЖК',
                lifetime: 5
            }))
        }
    }


    useEffect(() => {

        if (regionsIndexes.length > 0) {
            getRegions()
        }
    }, [regionsIndexes])

    const activeRegion = useSelector(selectActiveRegion)

    const onChangeRegion = (value) => {
        const payload = {
            value: value
        }
        dispatch(setActiveRegion(payload))

    }


    useEffect(() => {
        if (activeRegion !== null) {
            getComplexes()
        }

    }, [activeRegion])

    return (
        <div className={classes.selectContainer}>
            <TextInput value={filterRegions} changeValue={(value) => setFilterRegions(value)}
                       label={'Фильтр регионов'} isDisabled={regions.length === 0}/>


            <SingleList
                elements={regions.map(element => ({text: element.name, index: element.id})).filter(element => element.text.includes(filterRegions))}
                activeElement={activeRegion}
                selectEvent={onChangeRegion}
                label={'Регионы (выбрать нужное)'}
                isDisabled={regions.length === 0}
            />

            {isPendingRegions && <PlainLoader className={classes.selectLoader}/>}
        </div>
    )
}

export default RegionFilter