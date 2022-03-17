import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { selectAdvertisingOwnerInfo } from "~/store/reducers/advertising-owner";
import { addMessage } from "~/store/reducers/messages";
import { addInfo } from "~/store/reducers/advertising-owner";
import { selectToken } from "~/store/reducers/manager";

import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import TextInput from "~/components/ui-components/text-input";

import classes from "styles/pages-styles/banks.module.scss";

import axios from "axios";

const GeneralData = () => {
	const ownerInfo = useSelector(selectAdvertisingOwnerInfo);
	const token = useSelector(selectToken);
	const dispatch = useDispatch();

	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		const { name: ownerName, phone: ownerPhone, email: ownerEmail} = ownerInfo;
		setName(ownerName || "");
		setPhone(ownerPhone || "");
        setEmail(ownerEmail || "");
	}, [ownerInfo]);

	const updateOwnerData = async () => {
		try {
			setIsPending(true);
			const { data } = await axios.put(
				`http://localhost:8002/advesting-service/advesting-owner/update-owner`,
				{
					id: ownerInfo.id,
					phone,
					name,
					email
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
			</div>
			<TextInput value={phone} changeValue={(value) => setPhone(value)} />
            <TextInput value={email} changeValue={(value) => setEmail(value)} />
			<div style={{ maxWidth: "315px" }}>
				<PlainButton disabled={!name} clickEvent={updateOwnerData}>
					<span className="plain-text font-medium">Сохранить</span>
				</PlainButton>
			</div>
			{isPending && <PlainLoader className={classes.loader} />}
		</div>
	);
};

export default GeneralData;
