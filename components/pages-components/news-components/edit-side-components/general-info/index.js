import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import { selectToken } from "~/store/reducers/manager";
import { selectActiveNews, setActiveNewsData } from "~/store/reducers/news";
import { addMessage } from "~/store/reducers/messages";

import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import TextInput from "~/components/ui-components/text-input";
import SingleImageLoader from "~/components/ui-components/single-image-loader";
import ShowImage from "~/components/ui-components/show-image";

import axios from "axios";

import stringUtils from "~/utils/string.utils";

const GeneralInfo = () => {
	const dispatch = useDispatch();

	/* Селекторы */
	const token = useSelector(selectToken);
	const newsData = useSelector(selectActiveNews);

	/* Стейты */
	const [header, setHeader] = useState("");
	const [holderImage, setHolderImage] = useState("");
	const [isPending, setIsPending] = useState(false);

	/* Функция вычисления текущей даты + 24ч */
	const calculateDate = () => {
		const actualDate = new Date().getTime() + 60 * 60 * 24 * 1000;
		const datePublication = new Date(actualDate).toLocaleString("en-US", { timeZone: "Europe/Moscow" });

		// Короткий формат записи (dd-mm-yyyy). После проверки удалить, если не нужен
		// const convertDate = actualDate.getFullYear() + '-' + ('0' + (actualDate.getMonth() + 1)).slice(-2) + '-' +('0' + actualDate.getDate()).slice(-2)

		return datePublication;
	};

	/* Стейт значения value поля даты. Короткий формат записи (dd-mm-yyyy) */
	const [dateCreated, setDateCreated] = useState("");

	/* Конвертация формата даты с добавлением часового пояса. TODO: Если верно, передавать в запросе */
	const formatDate = new Date(dateCreated).toLocaleString("en-US", { timeZone: "Europe/Moscow" });

	useEffect(() => {
		if (newsData) {
			const { header, holder_image, date_publication } = newsData;
			setHeader(header || "");
			setHolderImage(holder_image || "");
      setDateCreated(date_publication || "");
		}
	}, [newsData]);

	const handlerSaveGeneralInfo = async () => {
		try {
			const previosUrlPattern = newsData.url.split("/news")[0];
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/news-manager/updateNews`,
				{
					id: newsData.id,
					header,
					holder_image: holderImage,
          date_publication: dateCreated,
					url: `${previosUrlPattern}/news/${stringUtils.urlValidator(stringUtils.convertToTransliteration(header))}__${newsData.id}`,
				},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			dispatch(
				setActiveNewsData({
					header,
					holder_image: holderImage,
					date_publication: dateCreated,
					url: `${previosUrlPattern}/news/${stringUtils.urlValidator(stringUtils.convertToTransliteration(header))}__${newsData.id}`,
				})
			);
			dispatch(
				addMessage({
					type: "success",
					text: "Новость обновлена",
				})
			);
		} catch (e) {
			console.error(e);
			dispatch(
				addMessage({
					type: "error",
					text: "Не удалось обновить новость",
				})
			);
		} finally {
			setIsPending(false);
		}
	};

	return (
		<div className="plain-container plain-row-container">
			<h1 className="header">Основная информация</h1>
			<div className={"plain-column-container"}>
				<TextInput label={"Заголовок"} value={header} changeValue={(value) => setHeader(value)} />

				<SingleImageLoader
					label={"Обложка (1600 х 900, не более 5Мб)"}
					fileName={holderImage}
					imageConfig={{
						height: 900,
						width: 1600,
					}}
					pathLoad={`images/news/${newsData.id}`}
					urlLoad={"/api/db/news-manager/uploadImage"}
					loadEvent={(value) => setHolderImage(value.url)}
				/>

				<TextInput label={"Дата публикации"} type={"date"} value={dateCreated ? dateCreated.split("T")[0] : ""} changeValue={(value) => setDateCreated(value)} />
			</div>
			<p>
				<span className="plain-text font-bold">Ссылка на новость: </span>
				<a
					className="plain-text"
          href={newsData.url}
					target={"_blank"}
          rel="noreferrer"
				>
					{newsData.url}
				</a>
			</p>
			<span className={"plain-text"}>Изображение обложки</span>
			<ShowImage path={holderImage} containerStyles={{ maxWidth: "400px" }} />
			<PlainButton disabled={!holderImage || !header || !dateCreated} className={"plain-button"} clickEvent={handlerSaveGeneralInfo}>
				Сохранить
			</PlainButton>
			{isPending && <PlainLoader className={"plain-loader"} />}
		</div>
	);
};

export default GeneralInfo;
