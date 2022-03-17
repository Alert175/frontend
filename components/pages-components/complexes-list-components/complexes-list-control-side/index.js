import RegionFilter from "~/components/pages-components/complexes-list-components/region-filter";
import classes from "~/components/pages-components/complexes-list-components/complexes-list-control-side/complexes-list-control-side.module.scss"




const ComplexesListControlSide = () => {
    return (
        <div className={classes.sideContainer}>
            <div className={classes.selectContainer}>
                <RegionFilter />
            </div>
        </div>
    )
}

export default ComplexesListControlSide