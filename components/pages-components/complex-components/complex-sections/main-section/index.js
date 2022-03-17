import classes from "./main-section.module.scss";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectComplexInfo } from "~/store/reducers/complex";
import { addInfo } from "~/store/reducers/complex";
import { addMessage } from "~/store/reducers/messages";
import { selectIndex, selectToken } from "~/store/reducers/manager";

import TextInput from "~/components/ui-components/text-input";
import PlainCheckbox from "~/components/ui-components/plain-checkbox";
import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import ShowImage from "~/components/ui-components/show-image";
import SingleImageLoader from "~/components/ui-components/single-image-loader";

import stringUtils from "utils/string.utils";

import axios from "axios";

const MainSection = () => {
	const [name, setName] = useState("");
	const [deadline, setDeadline] = useState("");
	const [link, setLink] = useState("");
	const [mainImage, setMainImage] = useState("");
	const [urlAddress, setUrlAddress] = useState("");
	const [isHanded, setIsHanded] = useState(false);

	const [isPending, setIsPending] = useState(false);

	const [subdomains, setSubdomains] = useState([]);
	const [region, setRegion] = useState(null);
	const [city, setCity] = useState(null);

	const dispatch = useDispatch();
	const complexInfo = useSelector(selectComplexInfo);
	const token = useSelector(selectToken);
	const managerId = useSelector(selectIndex);

	useEffect(() => {
		const { name, is_handed, url, main_image, deadline, link } = complexInfo;
		setName(name || "");
		setMainImage(main_image || "");
		setDeadline(deadline || "");
		setLink(link || "");
		setIsHanded(is_handed || false);
		setUrlAddress(url);
	}, [complexInfo]);

	/**
	 * Валидатор составления ссылки
	 * @returns
	 */
	const validatorUrlAddress = () => {
		const { regionName, cityName } = complexInfo;
		const transliterationUrl = stringUtils.convertToTransliteration(`complexes/${regionName}/${cityName}/${name}`);
		const validateUrl = stringUtils.urlValidator(transliterationUrl);
		setUrlAddress(validateUrl);
	};

	useEffect(() => {
		if (!name) {
			return;
		}
		validatorUrlAddress();
	}, [name]);

	/**
	 * Обновить данные по ЖК
	 */
	const updateComplexInfo = async () => {
		try {
			setIsPending(true);
			console.log(complexInfo.url);
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateComplex`,
				{
					id: complexInfo.id,
					name: name,
					main_image: mainImage,
					is_handed: isHanded,
					deadline,
					link,
					url: complexInfo.url === null || complexInfo.url === "" ? urlAddress : complexInfo.url,
				},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/add-action`, {
				content_manager_index: managerId,
				action_type: "update",
				section_name: "general",
				complex_index: complexInfo.id,
			});
			dispatch(
				addMessage({
					type: "success",
					text: "Данные успешно обновлены",
					lifetime: 5,
				})
			);
			dispatch(
				addInfo({
					name: name,
					main_image: mainImage,
					is_handed: isHanded,
					deadline,
					link,
					url: complexInfo.url === null || complexInfo.url === "" ? urlAddress : complexInfo.url,
				})
			);
		} catch (e) {
			console.error(e);
			dispatch(
				addMessage({
					type: "error",
					text: "Произошла ошибка при обновлении данных",
					lifetime: 5,
				})
			);
		} finally {
			setIsPending(false);
		}
	};

	/**
	 * Получить список поддоменов
	 */
	const getSubdomainsList = async () => {
		try {
			setIsPending(true);
			const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/subdomain/`);
			setSubdomains(data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsPending(false);
		}
	};

	/**
	 * Получить список поддоменов
	 */
	const getLocationData = async () => {
		try {
			setIsPending(true);
			const { regionName, cityName } = complexInfo;
			const { data: regionList } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/region/filter`, {
				name: regionName,
			});
			const { data: cityList } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/city/filter`, {
				name: cityName,
			});
			setRegion(regionList?.length ? regionList[0] : null);
			setCity(cityList?.length ? cityList[0] : null);
		} catch (error) {
			console.error(error);
		} finally {
			setIsPending(false);
		}
	};

	useEffect(() => {
		getSubdomainsList().then(() => getLocationData());
	}, []);

	/**
	 * Вычисление валидной ссылки на объект
	 * @returns {`${string}/developers/`|string}
	 */
	// const handlerComputedUrl = () => {
	// 	console.log(complexInfo.url === null || complexInfo.url === "");
	// 	return complexInfo.url === null || complexInfo.url === ""
	// 		? `${process.env.NEXT_PUBLIC_PORTAL_URL}/complexes/${urlAddress}`
	// 		: `${complexInfo.url}`;
	// };

	return (
		<div className={`${classes.mainContainer} row`}>
			<h1 className="header">Основная информация</h1>
			<div className={`column ${classes.inputsContainer}`}>
				<TextInput
					label={"Название ЖК"}
					holder={""}
					value={name}
					changeValue={(value) => setName(value)}
					style={{ border: name === "" ? "1px solid red" : "1px solid black" }}
				/>
				<TextInput label={"Ссылка на сайт"} holder={""} value={link} changeValue={(value) => setLink(value)} />
				<TextInput
					label={"Срок сдачи"}
					holder={""}
					value={deadline}
					changeValue={(value) => setDeadline(value)}
					style={{ border: deadline === "" ? "1px solid red" : "1px solid black" }}
				/>
				<PlainCheckbox isChecked={isHanded} label={"Дом сдан"} checkEvent={() => setIsHanded(!isHanded)} />
			</div>
			<SingleImageLoader
				urlLoad={"/api/db/content-manager/uploadImage"}
				className={"plain-button"}
				pathLoad={`complexes/${complexInfo.id}/images/main`}
				loadEvent={(value) => setMainImage(value.url)}
				imageConfig={{
					height: 1080,
					width: 1920,
					fit: "cover",
				}}
			/>
			<ShowImage
				label={"Главное изображение"}
				className={"contain-image"}
				path={mainImage}
				containerStyles={{ width: 300 }}
				imageStyles={{ height: 300, width: 300, background: "gray", borderRadius: 5, objectFit: "cover" }}
			/>
			<p>
				<span className="plain-text font bold">Адрес страницы ЖК: </span>
				{/* eslint-disable-next-line */}
				<a href={`${process.env.NEXT_PUBLIC_PORTAL_URL}/${urlAddress}_${complexInfo.id}`} target={"_blank"}>
					{process.env.NEXT_PUBLIC_PORTAL_URL}/{urlAddress}_{complexInfo.id}
				</a>
			</p>
			<PlainButton disabled={!name || !deadline} className={"plain-button"} clickEvent={updateComplexInfo}>
				<span>Сохранить</span>
			</PlainButton>
			{isPending && <PlainLoader className={classes.loader} />}
		</div>
	);
};

export default MainSection;
