import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import { selectToken } from "~/store/reducers/manager";
import { selectActiveArticle, setActiveArticlesData } from "~/store/reducers/article";
import { addMessage } from "~/store/reducers/messages";

import PlainLoader from "~/components/ui-components/plain-loader";
import TextInput from "~/components/ui-components/text-input";
import MultipleList from "~/components/ui-components/list-components/multiple-list";
import PlainButton from "~/components/ui-components/plain-button";

import axios from "axios";
import useAxios from "~/hooks/use-axios.hook";
import stringUtils from "~/utils/string.utils";

import { subdomains } from "./subdomains.data";

const AnchorageInfo = () => {
	const dispatch = useDispatch();
	const token = useSelector(selectToken);
	const articleData = useSelector(selectActiveArticle);

	// запрашиваю все регионы
	const [staticRegions, errorStaticRegions, isLoadStaticRegions] = useAxios({
		url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/region/`,
		method: "get",
	});
	// запрашиваю все города
	const [staticCities, errorStaticCities, isLoadStaticCities] = useAxios({
		url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/city/`,
		method: "get",
	});

	// запрашиваю всех застройщиков
	const [staticDevelopers, errorStaticDevelopers, isLoadStaticDevelopers] = useAxios({
		url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/developer/get-with-ordered-fields`,
		method: "get",
	});
	// запрашиваю все ЖК
	const [staticComplexes, errorStaticComplexes, isLoadStaticComplexes] = useAxios({
		url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/complex/get-with-ordered-fields `,
		method: "get",
	});
	// запрашиваю все КП
	const [staticVillages, errorStaticVillages, isLoadStaticVillages] = useAxios({
		url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/village/get-with-ordered-fields`,
		method: "get",
	});

	// данные по закреплению из статьи
	const [regions, setRegions] = useState([]);
	const [cities, setCities] = useState([]);
	const [developers, setDevelopers] = useState([]);
	const [complexes, setComplexes] = useState([]);
	const [villages, setVillages] = useState([]);

	// состояния по поисковым словам
	const [findRegions, setFindRegions] = useState("");
	const [findCities, setFindCities] = useState("");
	const [findDevelopers, setFindDevelopers] = useState("");
	const [findComplexes, setFindComplexes] = useState("");
	const [findVillages, setFindVillages] = useState("");
	const [contentUrl, setContentUrl] = useState([]);

	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		if (articleData) {
			const { region_indexes, cities_indexes, developers_indexes, complexes_indexes, villages_indexes, url } = articleData;
			setRegions(region_indexes || []);
			setCities(cities_indexes || []);
			setDevelopers(developers_indexes || []);
			setComplexes(complexes_indexes || []);
			setVillages(villages_indexes || []);
			setContentUrl(url || "");
		}
	}, [articleData]);

	const handlerSaveAnchorageInfo = async () => {
		try {
			setIsPending(true);
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/news-manager/updateArticle`,
				{
					id: articleData.id,
					region_indexes: regions,
					cities_indexes: cities,
					developers_indexes: developers,
					complexes_indexes: complexes,
					villages_indexes: villages,
                    url: contentUrl,
				},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			dispatch(
				setActiveArticlesData({
					region_indexes: regions,
					cities_indexes: cities,
					developers_indexes: developers,
					complexes_indexes: complexes,
					villages_indexes: villages,
                    url: contentUrl,
				})
			);
			dispatch(
				addMessage({
					type: "success",
					text: "Статья обновлена",
				})
			);
		} catch (e) {
			console.error(e);
			dispatch(
				addMessage({
					type: "error",
					text: "Не удалось обновить статью",
				})
			);
		} finally {
			setIsPending(false);
		}
	};

    /**
	 * Генерация валидной ссылки на новость
	 * 1) Создаю стандартную ссылку
	 * 2) Если не прошел валидацию, верну стандартную
	 * 3) Если нашел один поддомен по городу, верну ссылку с поддоменом
	 * 4) Если нашел поддомены по региону, верну ссылку с последним поддоменом
	 * 5) Если ни чего не нашел, верну стандартную ссылку
	 * @param {*} urlPrefix
	 * @returns
	 */
	const generateValidUrl = (urlPrefix = "") => {
		try {
			const { id, header } = articleData;
			const validUrl = `${stringUtils.urlValidator(stringUtils.convertToTransliteration(header))}__${id}`;
			if (!Array.isArray(regions) || !regions.length || regions.length > 1) {
				return {
					result: `https://${process.env.NEXT_PUBLIC_SITE_URL}/${urlPrefix}/${validUrl}`,
					status: "success",
				};
			}
			const findSubDomainForRegion = subdomains.filter((element) => element.region_index === regions[0]);
			let findSubDomainForCity = [];
			if (cities.length === 1) {
				findSubDomainForCity = subdomains.filter((element) => element.city_index === cities[0]);
			}
			if (findSubDomainForCity.length === 1) {
				return {
					result: `https://${findSubDomainForCity[0].sub_domain_name}.${process.env.NEXT_PUBLIC_SITE_URL}/${urlPrefix}/${validUrl}`,
					status: "success",
				};
			}
			if (findSubDomainForRegion.length) {
				return {
					result: `https://${findSubDomainForRegion[findSubDomainForRegion.length - 1].sub_domain_name}.${
						process.env.NEXT_PUBLIC_SITE_URL
					}/${urlPrefix}/${validUrl}`,
					status: "success",
				};
			}
			return {
				result: `https://${process.env.NEXT_PUBLIC_SITE_URL}/${urlPrefix}/${validUrl}`,
				status: "success",
			};
		} catch (error) {
			console.error(error);
			return {
				result: null,
				status: "error",
			};
		}
	};

    useEffect(() => {
		const { result, status } = generateValidUrl("articles");
		if (status === "success") setContentUrl(result)
	}, [regions, cities]);

	if (!errorStaticRegions && !errorStaticDevelopers && !errorStaticCities && !errorStaticComplexes && !errorStaticVillages) {
		return (
			<div className="plain-container plain-row-container">
				<h1 className="header">Закрепление новости</h1>
				<div className="plain-column-container" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 40 }}>
					<MultipleFindElement
						labelFind={"Поиск региона"}
						findValue={findRegions}
						setFindValue={setFindRegions}
						labelList={"Закрепленные регионы"}
						listValue={staticRegions}
						selectedValues={regions}
						selectListValue={setRegions}
						raiseListValue={setRegions}
					/>
					<MultipleFindElement
						labelFind={"Поиск города"}
						findValue={findCities}
						setFindValue={setFindCities}
						labelList={"Закрепленные города"}
						listValue={staticCities}
						selectedValues={cities}
						selectListValue={setCities}
						raiseListValue={setCities}
					/>
				</div>
				<div className="plain-column-container" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 40 }}>
					<MultipleFindElement
						labelFind={"поиск ЖК"}
						findValue={findComplexes}
						setFindValue={setFindComplexes}
						labelList={"Закрепленные ЖК"}
						listValue={staticComplexes}
						selectedValues={complexes}
						selectListValue={setComplexes}
						raiseListValue={setComplexes}
					/>
					<MultipleFindElement
						labelFind={"поиск КП"}
						findValue={findVillages}
						setFindValue={setFindVillages}
						labelList={"Закрепленные КП"}
						listValue={staticVillages}
						selectedValues={villages}
						selectListValue={setVillages}
						raiseListValue={setVillages}
					/>
				</div>
				<MultipleFindElement
					labelFind={"поиск застройщика"}
					findValue={findDevelopers}
					setFindValue={setFindDevelopers}
					labelList={"Закрепленные застройщики"}
					listValue={staticDevelopers}
					selectedValues={developers}
					selectListValue={setDevelopers}
					raiseListValue={setDevelopers}
				/>
				<PlainButton className={"plain-button"} clickEvent={handlerSaveAnchorageInfo}>
					Сохранить
				</PlainButton>
				{isPending && <PlainLoader className={"plain-loader"} />}
			</div>
		);
	}

	if (isLoadStaticRegions || isLoadStaticCities || isLoadStaticDevelopers || isLoadStaticComplexes || isLoadStaticVillages) {
		return <PlainLoader />;
	}

	return <span className={"plain-text"}>Произошла ошибка при загрузке данных, попробуйте позже</span>;
};

const MultipleFindElement = ({
	labelFind = "",
	labelList = "",
	findValue = "",
	setFindValue = Function,
	listValue = [],
	selectedValues = [],
	selectListValue = Function,
	raiseListValue = Function,
}) => {
	const [isShow, setIsShow] = useState(false);
	if (Array.isArray(listValue) && listValue.length > 0) {
		if (isShow) {
			return (
				<div className={"plain-row-container"}>
					<TextInput label={labelFind} value={findValue} changeValue={(value) => setFindValue(value)} />
					<MultipleList
						label={labelList}
						activeElements={selectedValues}
						selectEvent={(value) => selectListValue((prevState) => [...prevState, value])}
						raiseEvent={(value) => raiseListValue((prevState) => prevState.filter((element) => element !== value))}
						elements={listValue
							.map((element) => {
								return { text: element.name, index: element.id };
							})
							.filter((element) => element.text.includes(findValue))}
					/>
					<PlainButton clickEvent={() => selectListValue([])}>Сбросить выбранное</PlainButton>
					<PlainButton
						clickEvent={() => setIsShow(false)}
						styleConfig={{
							backgroundColor: "white",
							color: "black",
							border: "1px solid black",
						}}
					>
						Скрыть {labelFind}
					</PlainButton>
				</div>
			);
		}
		return <PlainButton clickEvent={() => setIsShow(true)}>Показать {labelFind}</PlainButton>;
	}

	return null;
};

export default AnchorageInfo;
