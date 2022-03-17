import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { asyncCheckIsAuth } from "~/store/reducers/manager";
import { selectActiveSubDomainIndex, selectActivePage } from "~/store/reducers/content";
import EditContent from "~/components/pages-components/content-page-components/edit-content";

import classes from "styles/pages-styles/complex.module.scss";
import ChangePageSection from "~/components/pages-components/content-page-components/change-page-section";

const ContentPage = () => {
	const dispatch = useDispatch();
	const activeSubDomainIndex = useSelector(selectActiveSubDomainIndex);
	const activePage = useSelector(selectActivePage);

	useEffect(() => {
		dispatch(asyncCheckIsAuth());
	}, []);

	return (
		<div className={classes.pageContainer}>
			<EditContent />
			{activeSubDomainIndex !== null && activePage !== null && (
				<div className="row" style={{ gap: 40 }}>
					{activePage === 0 && <ChangePageSection page={"main_page"} section={"seo"} />}
					{activePage === 0 && <ChangePageSection page={"main_page"} section={"developers"} />}
					{activePage === 0 && <ChangePageSection page={"main_page"} section={"complexes"} />}
					{activePage === 0 && <ChangePageSection page={"main_page"} section={"villages"} />}
					{activePage === 0 && <ChangePageSection page={"main_page"} section={"banks"} />}
					{activePage === 0 && <ChangePageSection page={"main_page"} section={"news"} />}
					{activePage === 0 && <ChangePageSection page={"main_page"} section={"articles"} />}
					{activePage === 0 && <ChangePageSection page={"main_page"} section={"h1_section"} />}

					{activePage === 1 && <ChangePageSection page={"complexes_page"} section={"seo"} />}
					{activePage === 1 && <ChangePageSection page={"complexes_page"} section={"header"} />}
					{activePage === 1 && <ChangePageSection page={"complexes_page"} section={"hight_raiting"} />}
					{activePage === 1 && <ChangePageSection page={"complexes_page"} section={"handed_complexes"} />}
					{activePage === 1 && <ChangePageSection page={"complexes_page"} section={"building_complexes"} />}
					{activePage === 1 && <ChangePageSection page={"complexes_page"} section={"h1_section"} />}

					{activePage === 2 && <ChangePageSection page={"developers_page"} section={"seo"} />}
					{activePage === 2 && <ChangePageSection page={"developers_page"} section={"header"} />}
					{activePage === 2 && <ChangePageSection page={"developers_page"} section={"h1_section"} />}

					{activePage === 3 && <ChangePageSection page={"flats_page"} section={"seo"} />}
					{activePage === 3 && <ChangePageSection page={"flats_page"} section={"header"} />}
					{activePage === 3 && <ChangePageSection page={"flats_page"} section={"h1_section"} />}

					{activePage === 4 && <ChangePageSection page={"journal_page"} section={"seo"} />}
					{activePage === 4 && <ChangePageSection page={"journal_page"} section={"header"} />}
					{activePage === 4 && <ChangePageSection page={"journal_page"} section={"h1_section"} />}
				</div>
			)}
		</div>
	);
};

export default ContentPage;
