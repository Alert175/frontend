import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import objectUtils from "utils/object.utils";
import { asyncCheckIsAuth } from "~/store/reducers/manager";
import { selectComplexInfo } from "~/store/reducers/complex";
import classes from "styles/pages-styles/complex.module.scss";
import ControlSide from "~/components/pages-components/complex-components/control-side";
import EditSide from "~/components/pages-components/complex-components/edit-side";



const ComplexPage = () => {
    const dispatch = useDispatch()
    const complexInfo = useSelector(selectComplexInfo)

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

export default ComplexPage;