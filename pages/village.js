import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import objectUtils from 'utils/object.utils';

import {asyncCheckIsAuth} from "~/store/reducers/manager";
import {selectVillageInfo} from "~/store/reducers/village";

import classes from 'styles/pages-styles/complex.module.scss'

import ControlSide from "~/components/pages-components/village-components/control-side";
import EditSide from "~/components/pages-components/village-components/edit-side";

const VillagePage = () => {
    const dispatch = useDispatch()
    const complexInfo = useSelector(selectVillageInfo)

    useEffect(() => {
        dispatch(asyncCheckIsAuth())
    }, [])

    return (
        <div className={classes.pageContainer}>
            <ControlSide/>
            {objectUtils.isIterable(complexInfo) && <EditSide/>}
        </div>
    )
}

export default VillagePage;