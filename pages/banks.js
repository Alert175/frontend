import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {selectBankInfo} from "~/store/reducers/bank";

import {asyncCheckIsAuth} from "~/store/reducers/manager";

import classes from 'styles/pages-styles/complex.module.scss';

import objectUtils from 'utils/object.utils'

import BanksControlSide from "~/components/pages-components/banks-component/banks-control-side";
import EditSide from "~/components/pages-components/banks-component/edit-side";

const BanksPage = () => {
    const dispatch = useDispatch()
    const banksData = useSelector(selectBankInfo)

    useEffect(() => {
        dispatch(asyncCheckIsAuth())
    }, [])

    return (
        <div className={classes.pageContainer}>
            <BanksControlSide/>
            {objectUtils.isIterable(banksData) && <EditSide/>}
        </div>
    )
}

export default BanksPage;