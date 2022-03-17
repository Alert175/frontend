import classes from '~/components/pages-components/complexes-list-components/complex-item/complex-item.module.scss'
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectToken} from '~/store/reducers/manager';
import PlainButton from '~/components/ui-components/plain-button';


const ComplexItem = ({complexId, complexName, developerId, regionId, cityId}) => {

    const [regionName, setRegionName] = useState(null)
    const [cityName, setCityName] = useState(null)
    const [developerName, setDeveloperName] = useState(null)
    const [complexNameValue, setComplexNameValue] = useState(complexName)

    const token = useSelector(selectToken)


    const getRegionName = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/region/filter`, {
                id: regionId
            })
            if (response.data.length === 0) {
                throw new Error('not found region')
            }
            setRegionName(response.data[0].name)

        } catch (e) {
            console.error(e)
        }
    }

    const getCityName = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/city/filter`, {
                id: cityId
            })
            if (response.data.length === 0) {
                new Error('not found cities')
            }
            setCityName(response.data[0].name)

        } catch (e) {
            console.error(e)
        }
    }


    const getDeveloperName = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/developer/filter`, {
                id: developerId
            })
            if (response.data.length === 0) {
                new Error('not found cities')
            }
            setDeveloperName(response.data[0].name)

        } catch (e) {
            console.error(e)
        }
    }


    useEffect(() => {
        getRegionName()
        getCityName()
        getDeveloperName()
    }, [])




    const onSaveValue = async () => {

        const newName = complexNameValue
        try {
           await axios.put(
               `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/complex/update`,
               {
               id: complexId,
               name: newName
            },
               {
                   headers: {
                       Authorization: token
                   }
            })

        } catch (e) {
            console.error(e)
        }


    }

    return (
        <div className={classes.item__container}>
            <div className={classes.item__info}>
                <div className={classes.item__element}>
                    <p className={classes.title}>ID ЖК:</p>
                    <p className={classes.value}>{complexId}</p>
                </div>
                <div className={classes.item__element}>
                    <p className={classes.title}>Название ЖК:</p>
                    <input
                        className={classes.input}
                        onChange={(event) => {
                            const newValue = event.target.value
                            setComplexNameValue(newValue)
                        }}
                        value={complexNameValue}
                    />
                </div>
                <div className={classes.item__element}>
                    <p className={classes.title}>Название застройщика:</p>
                    <p className={classes.value}>{developerName}</p>
                </div>
                <div className={classes.item__element}>
                    <p className={classes.title}>Регион:</p>
                    <p className={classes.value}>{regionName}</p>
                </div>
                <div className={classes.item__element}>
                    <p className={classes.title}>Город:</p>
                    <p className={classes.value}>{cityName}</p>
                </div>
            </div>

            <div className={classes.btn_block}>
                <PlainButton clickEvent={onSaveValue}>СОХРАНИТЬ</PlainButton>
            </div>

        </div>
    )
}

export default ComplexItem