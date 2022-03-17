import MainSection from "~/components/pages-components/village-components/village-sections/main-section";
import SeoSection from "~/components/pages-components/village-components/village-sections/seo-section";
import AboutVillageSection from "~/components/pages-components/village-components/village-sections/about-village-section";
import AdvantagesSection from "~/components/pages-components/village-components/village-sections/advantages-section";
import ConsumerQualities from "~/components/pages-components/village-components/village-sections/qualities-section";
import GallerySection from "~/components/pages-components/village-components/village-sections/gallery-section";
import DocumentsSection from "~/components/pages-components/village-components/village-sections/documents-section";
import PaymentsSection from "~/components/pages-components/village-components/village-sections/payments-section";
import ProgressSection from "~/components/pages-components/village-components/village-sections/progress-section";
import BanksSections from "~/components/pages-components/village-components/village-sections/banks-sections";
import ContactSection from "~/components/pages-components/village-components/village-sections/contact-section";

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
            <AboutVillageSection/>
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