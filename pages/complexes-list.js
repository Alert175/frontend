import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {asyncCheckIsAuth} from '~/store/reducers/manager';
import {selectListComplexes} from '~/store/reducers/complex';
import classes from '~/styles/pages-styles/complex.module.scss';
import ComplexesListControlSide from '~/components/pages-components/complexes-list-components/complexes-list-control-side';
import ComplexItem from '~/components/pages-components/complexes-list-components/complex-item';
import PlainButton from '~/components/ui-components/plain-button';


/**
 * получение списка ЖК, и разбиене отображения по 50 элементов
 * @returns 
 */
const ComplexesList = () => {
    const complexes = useSelector(selectListComplexes)
    const dispatch = useDispatch()

    const [complexLastIndex, setComplexLastIndex] = useState(50);
    const [isFinishList, setIsFinish] = useState(false);

    useEffect(() => {
        setComplexLastIndex(50);
        complexes.length > 50 ? setIsFinish(false) : setIsFinish(true);
    }, [complexes])

    useEffect(() => {
        complexes.length > complexLastIndex ? setIsFinish(false) : setIsFinish(true);
    }, [complexLastIndex])

    useEffect(() => {
        dispatch(asyncCheckIsAuth())
    }, [])


    return (
        <div className={classes.pageContainer}>
            <ComplexesListControlSide/>
           <div>
               {
                   complexes.length > 0 ?
                       (complexes.map((complex, index) =>
                           index <= complexLastIndex
                           ? <ComplexItem
                                key={complex.id}
                                complexId={complex.id}
                                complexName={complex.name}
                                developerId={complex.developer_index}
                                regionId={complex.region_index}
                                cityId={complex.city_index}
                            />
                            : null))
                       : ('Регион не выбран')
               }
               {
                   complexes.length > 0 && !isFinishList
                   ? <PlainButton className={'plain-button'} clickEvent={() => setComplexLastIndex(prevState => prevState + 50)}>
                       Показать еще
                   </PlainButton>
                   : null
               }
           </div>
        </div>
    )
}

export default ComplexesList;
