import MainSection from "~/components/pages-components/complex-components/complex-sections/main-section";
import SeoSection from "~/components/pages-components/complex-components/complex-sections/seo-section";
import AboutComplexSection from "~/components/pages-components/complex-components/complex-sections/about-complex-section";
import AdvantagesSection from "~/components/pages-components/complex-components/complex-sections/advantages-section";
import ConsumerQualities from "~/components/pages-components/complex-components/complex-sections/qualities-section";
import GallerySection from "~/components/pages-components/complex-components/complex-sections/gallery-section";
import DocumentsSection from "~/components/pages-components/complex-components/complex-sections/documents-section";
import PaymentsSection from "~/components/pages-components/complex-components/complex-sections/payments-section";
import ProgressSection from "~/components/pages-components/complex-components/complex-sections/progress-section";
import BanksSections from "~/components/pages-components/complex-components/complex-sections/banks-sections";
import ContactSection from "~/components/pages-components/complex-components/complex-sections/contact-section";

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
        <div className='row' style={{gap: '80px', alignContent: 'start'}}>
            <MainSection/>
            <Line/>
            <SeoSection/>
            <Line/>
            <AboutComplexSection/>
            <Line/>
            <AdvantagesSection/>
            <Line/>
            <ConsumerQualities/>
            <Line/>
            <GallerySection/>
            <Line/>
            <DocumentsSection/>
            <Line/>
            <PaymentsSection/>
            <Line/>
            <ProgressSection/>
            <Line/>
            <BanksSections/>
            <Line/>
            <ContactSection/>
        </div>
    )
}

export default EditSide;