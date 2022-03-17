import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { selectBankInfo } from "~/store/reducers/bank";
import { addMessage } from "~/store/reducers/messages";
import { addInfo } from "~/store/reducers/bank";
import { selectToken } from "~/store/reducers/manager";

import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import TextInput from "~/components/ui-components/text-input";
import SingleImageLoader from "~/components/ui-components/single-image-loader";
import ShowImage from "~/components/ui-components/show-image";
import TextEditor from "~/components/ui-components/text-editor";

import classes from "styles/pages-styles/banks.module.scss";

import axios from "axios";

const GeneralData = () => {
	const bankInfo = useSelector(selectBankInfo);
	const token = useSelector(selectToken);
	const dispatch = useDispatch();

	const [name, setName] = useState("");
	const [logo, setLogo] = useState("");
	const [description, setDescription] = useState("");
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		const { name: bankName, image, description: bankDescription } = bankInfo;
		setName(bankName || "");
		setDescription(bankDescription || "");
		setLogo(image || "");
	}, [bankInfo]);

	const updateBankData = async () => {
		try {
			setIsPending(true);
			const { data } = await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateBank`,
				{
					id: bankInfo.id,
					description,
					name,
					image: logo || "",
				},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			dispatch(addInfo(data.data));
			dispatch(addMessage({ type: "success", text: "Информация обновлена" }));
		} catch (e) {
			console.error(e);
			dispatch(addMessage({ type: "error", text: "Не удалось обновить информацию" }));
		} finally {
			setIsPending(false);
		}
	};
	return (
		<div className={`${classes.sectionContainer} plain-row-container`} style={{ maxWidth: "650px" }}>
			<h1 className="header">Основная информация</h1>
			<div className="plain-row-container" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
				<TextInput value={name} changeValue={(value) => setName(value)} />
				<SingleImageLoader
					pathLoad={`images/banks/${bankInfo.id}`}
					urlLoad={`/api/db/content-manager/uploadImage`}
					fileName={logo ? logo.split("/")[logo.split("/").length - 1] : ""}
					loadEvent={(value) => {
						setLogo(value.url);
					}}
				/>
			</div>
			<ShowImage
				label={"Главное изображение"}
				className={"contain-image"}
				path={logo}
				containerStyles={{ width: 300 }}
				imageStyles={{ height: 300, width: 300, background: "gray", borderRadius: 5, objectFit: "cover" }}
			/>
			<TextEditor value={description} changeEvent={setDescription} />
			<div style={{ maxWidth: "315px" }}>
				<PlainButton disabled={!name} clickEvent={updateBankData}>
					<span className="plain-text font-medium">Сохранить</span>
				</PlainButton>
			</div>
			{isPending && <PlainLoader className={classes.loader} />}
		</div>
	);
};

export default GeneralData;
