import GeneralData from "~/components/pages-components/banks-component/banks-sections/general-data";
import RatesData from "~/components/pages-components/banks-component/banks-sections/rates-data";

const Line = () => {
    return(
        <div style={{
            backgroundColor: '#0C0C0C',
            borderRadius: '12px',
            width: '100%',
            height: '1px'
        }}/>
    )
}

const EditSide = () => {
    return(
        <div className="plain-row-container">
            <GeneralData/>
            <Line/>
            <RatesData/>
        </div>
    )
}

export default EditSide;