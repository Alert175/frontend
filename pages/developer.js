import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {asyncCheckIsAuth} from "~/store/reducers/manager";
import {selectDeveloperInfo} from "~/store/reducers/developer";

import classes from 'styles/pages-styles/complex.module.scss';

import objectUtils from '~/utils/object.utils';

import HorizontalLine from "~/components/general-components/horizontal-line";
import ControlSide from "~/components/pages-components/developers-components/control-side";
import GeneralSection from "~/components/pages-components/developers-components/edit-sections/general-section";
import ConfigSection from "~/components/pages-components/developers-components/edit-sections/config-section";
import SeoSection from "~/components/pages-components/developers-components/edit-sections/seo-section";
import AboutSection from "~/components/pages-components/developers-components/edit-sections/about-section";
import GallerySection from "~/components/pages-components/developers-components/edit-sections/gallery-section";
import ContactSection from "~/components/pages-components/developers-components/edit-sections/contact-section";

const DeveloperPage = () => {
    const dispatch = useDispatch()
    const developer = useSelector(selectDeveloperInfo)

    useEffect(() => {
        dispatch(asyncCheckIsAuth())
    }, [])
    return (
        <div className={classes.pageContainer}>
            <ControlSide/>
            {
                objectUtils.isIterable(developer) &&
                <div className='plain-row-container' style={{gap: '80px'}}>
                    <GeneralSection/>
                    <HorizontalLine/>
                    <SeoSection/>
                    <HorizontalLine/>
                    <AboutSection/>
                    <HorizontalLine/>
                    <GallerySection/>
                    <HorizontalLine/>
                    <ContactSection/>
                    <HorizontalLine/>
                    <ConfigSection/>
                </div>
            }
        </div>
    )
}

export default DeveloperPage;