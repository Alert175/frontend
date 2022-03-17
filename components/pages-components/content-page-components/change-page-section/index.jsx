import PropTypes from "prop-types";
import { selectActiveSubDomainIndex, selectContentList, addContentList, setContentElement } from "~/store/reducers/content";
import axios from "axios";
import { useState, useEffect } from "react";
import { addMessage } from "~/store/reducers/messages";
import { useSelector, useDispatch } from "react-redux";

import classes from "./index.module.scss";
import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import PlainTextarea from "~/components/ui-components/plain-textarea";

const pageNames = {
	main_page: "Главная страница",
	complexes_page: "Страница каталога ЖК",
	developers_page: "Страница застройщиков",
	flats_page: "Страница фильтра планировок",
	jounral_page: "Страница журнал",
};

const sectionNames = {
	seo: "SEO блок",
	developers: "Блок Застройщиков",
	complexes: "Блок ЖК",
	villages: "Блок КП",
	banks: "Блок банки",
	news: "Блок новостей",
	articles: "Блок статей",
	header: "Блок заголовка",
	hight_raiting: "Блок топ рейтинга",
	handed_complexes: "Блок сданные ЖК",
	building_complexes: "Блок строящиеся ЖК",
	h1_section: "Блок H1",
};

export default function ChangePageSection({ page, section }) {
	const activeSubDomainIndex = useSelector(selectActiveSubDomainIndex);
	const contentList = useSelector(selectContentList);
	const dispatch = useDispatch();

	const [isPending, setIsPending] = useState(false);
	const [elementIndex, setElementIndex] = useState(null);
	const [header, setHeader] = useState("");
	const [subHeader, setSubHeader] = useState("");

	/**
	 * Вычисление текущего индекса элемента из спика, и занесения данных контента
	 */
	useEffect(() => {
		if (!Array.isArray(contentList)) return null;
		const findIndex = contentList.findIndex(
			(element) => element.sub_domain_index === activeSubDomainIndex && element.page === page && element.section === section
		);
		setElementIndex(findIndex !== -1 ? findIndex : null);
		if (findIndex === -1) return;
		console.log(contentList[findIndex].header);
		setHeader(contentList[findIndex].header);
		setSubHeader(contentList[findIndex].sub_header);
	}, [activeSubDomainIndex, contentList]);

	/**
	 * Создание секции с пустыми данными по контенту
	 */
	const createContentSection = async () => {
		try {
			setIsPending(true);
			const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/header/create-header`, {
				sub_domain_index: activeSubDomainIndex,
				page,
				section,
			});
			dispatch(addContentList(data));
			dispatch(
				addMessage({
					type: "success",
					text: "секция создана",
				})
			);
		} catch (error) {
			console.error(error);
			dispatch(
				addMessage({
					type: "error",
					text: "ошибка при создании секции",
				})
			);
		} finally {
			setIsPending(false);
		}
	};

	/**
	 * Обновление сеции по ключу
	 */
	const updateContentSection = async () => {
		try {
			setIsPending(true);
			const { data } = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/header/update-header`, {
				id: contentList[elementIndex].id,
				header,
				sub_header: subHeader
			});
			dispatch(setContentElement({index: elementIndex, data: data.data}));
			dispatch(
				addMessage({
					type: "success",
					text: "секция обновлена",
				})
			);
		} catch (error) {
			console.error(error);
			dispatch(
				addMessage({
					type: "error",
					text: "ошибка при обновлении секции",
				})
			);
		} finally {
			setIsPending(false);
		}
	};

	if (elementIndex !== null) {
		return (
			<div className="plain-row-container">
				<div className="column plain-gap start-content">
					<span className="plain-text font-bold">{pageNames[page]}</span>
					<span className="plain-text">{sectionNames[section]}</span>
				</div>
				<PlainTextarea label={"Заголовок"} value={header} changeValue={setHeader} />
				<PlainTextarea label={"Подзаголовок"} value={subHeader} changeValue={setSubHeader} />
				<PlainButton className="plain-button" clickEvent={updateContentSection} disabled={header === "" || subHeader === ""}>Сохранить</PlainButton>
				{isPending && <PlainLoader className={"plain-loader"} />}
			</div>
		);
	}

	return (
		<div className="column plain-gap">
			<div className="row plain-gap">
				<span className="plain-text font-bold">{pageNames[page]}</span>
				<span className="plain-text">{sectionNames[section]}</span>
			</div><PlainButton clickEvent={createContentSection} className="plain-button">Добавить</PlainButton>
			{isPending && <PlainLoader className={"plain-loader"} />}
		</div>
	);
}

ChangePageSection.propTypes = {
	page: PropTypes.string,
	section: PropTypes.string,
};

ChangePageSection.defaultProps = {
	page: "",
	section: "",
};
