import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { asyncCheckIsAuth } from "~/store/reducers/manager";
import { selectActiveArticle } from "~/store/reducers/article";

import classes from "styles/pages-styles/complex.module.scss";

import ControlSide from "~/components/pages-components/article-components/control-side";
import HorizontalLine from "~/components/general-components/horizontal-line";
import GeneralInfo from "~/components/pages-components/article-components/edit-side-components/general-info";
import SeoInfo from "~/components/pages-components/article-components/edit-side-components/seo-info";
import ContentInfo from "~/components/pages-components/article-components/edit-side-components/content-info";
import AnchorageInfo from "~/components/pages-components/article-components/edit-side-components/anchorage-info";

const ArticlePage = () => {
	const dispatch = useDispatch();
	const activeArticle = useSelector(selectActiveArticle);

	useEffect(() => {
		dispatch(asyncCheckIsAuth());
	}, []);

	return (
		<div className={classes.pageContainer}>
			<ControlSide />
			{activeArticle && (
				<div className={"plain-row-container"}>
					<GeneralInfo />
					<HorizontalLine />
					<SeoInfo />
					<HorizontalLine />
					<ContentInfo />
					<HorizontalLine />
					<AnchorageInfo />
				</div>
			)}
		</div>
	);
};

export default ArticlePage;
