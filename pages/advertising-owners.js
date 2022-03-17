import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {selectAdvertisingOwnerInfo} from "~/store/reducers/advertising-owner";

import {asyncCheckIsAuth} from "~/store/reducers/manager";

import AdvertisingOwnerControlSide from "~/components/pages-components/advertising-owners-components/advertising-control-side";
import classes from 'styles/pages-styles/complex.module.scss';

import objectUtils from 'utils/object.utils'
import EditSide from "~/components/pages-components/advertising-owners-components/edit-side";

const AdvertisingOwnersPage = () => {
    const dispatch = useDispatch()
    const ownersData = useSelector(selectAdvertisingOwnerInfo)

    useEffect(() => {
        dispatch(asyncCheckIsAuth())
    }, [])

    return (
        <div className={classes.pageContainer}>
            <AdvertisingOwnerControlSide />
            {objectUtils.isIterable(ownersData) && <EditSide />}
        </div>
    )
}

export default AdvertisingOwnersPage;