import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {asyncCheckIsAuth} from "~/store/reducers/manager";
import {selectActiveNews} from "~/store/reducers/news";

import classes from 'styles/pages-styles/complex.module.scss';

import ControlSide from "~/components/pages-components/news-components/control-side";
import HorizontalLine from "~/components/general-components/horizontal-line";
import GeneralInfo from "~/components/pages-components/news-components/edit-side-components/general-info";
import SeoInfo from "~/components/pages-components/news-components/edit-side-components/seo-info";
import ContentInfo from "~/components/pages-components/news-components/edit-side-components/content-info";
import AnchorageInfo from "~/components/pages-components/news-components/edit-side-components/anchorage-info";

const NewsPage = () => {
    const dispatch = useDispatch()
    const activeNews = useSelector(selectActiveNews);

    useEffect(() => {
        dispatch(asyncCheckIsAuth())
    }, [])

    return (
        <div className={classes.pageContainer}>
            <ControlSide/>
            {
                activeNews &&
                <div className={'plain-row-container'}>
                    <GeneralInfo/>
                    <HorizontalLine/>
                    <SeoInfo/>
                    <HorizontalLine/>
                    <ContentInfo/>
                    <HorizontalLine/>
                    <AnchorageInfo/>
                    <HorizontalLine/>
                </div>
            }
        </div>
    )
}

export default NewsPage;