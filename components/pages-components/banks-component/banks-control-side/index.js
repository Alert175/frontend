import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { asyncCheckIsAuth, selectToken } from "~/store/reducers/manager";
import { addMessage } from "~/store/reducers/messages";
import { addInfo, clearInfo } from "~/store/reducers/bank";

import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";

import classes from "./banks-control-side.module.scss";

import axios from "axios";
import PlainList from "~/components/ui-components/list-components/plain-list";

const BanksControlSide = () => {
	const [banks, setBanks] = useState([]);
	const [activeBank, setActiveBank] = useState(null);
	const [isPending, setIsPending] = useState(false);

	const dispatch = useDispatch();
	const token = useSelector(selectToken);

	useEffect(() => {
		dispatch(asyncCheckIsAuth());
		getBanks();
	}, []);

	const getBanks = async () => {
		try {
			setIsPending(true);
			const {
				data: { currentList },
			} = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/bank/find`, { 
				groupLimit: 10000,
				diffValue: 0,
			});
			setBanks(currentList);
			dispatch(
				addMessage({
					type: "success",
					text: "Банки получены",
				})
			);
		} catch (e) {
			console.error(e);
			dispatch(
				addMessage({
					type: "error",
					text: "Не удалось загрузить банки",
				})
			);
		} finally {
			setIsPending(false);
		}
	};

	const handlerSelectBank = (index) => {
		if (index === null) {
			return;
		}
		setActiveBank(index);
		dispatch(clearInfo());
		dispatch(addInfo(banks[index]));
		dispatch(
			addMessage({
				type: "info",
				text: `Выбран банк ${banks[index].name}`,
			})
		);
	};

	const createBank = async () => {
		try {
			setIsPending(true);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/createBank`,
				{ name: "New bank" },
				{
					headers: {
						Authorization: token,
					},
				}
			);
			setActiveBank(null);
			setBanks((prevState) => [...prevState, response.data]);
			dispatch(
				addMessage({
					type: "success",
					text: "Банк создан",
				})
			);
		} catch (e) {
			console.error(e);
			dispatch(
				addMessage({
					type: "error",
					text: "Не удалось создать банк",
				})
			);
		} finally {
			setIsPending(false);
		}
	};

	const handlerDeleteFile = async (url) => {
		try {
			setIsPending(true);
			await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/deleteFile`,
				{ path: url },
				{
					headers: {
						Authorization: token,
					},
				}
			);
			setActiveBank(null);
			dispatch(
				addMessage({
					type: "success",
					text: "Логотип банка удален",
				})
			);
		} catch (e) {
			console.error(e);
			dispatch(
				addMessage({
					type: "error",
					text: "Не удалось удалить логотип банка",
				})
			);
		} finally {
			setIsPending(false);
		}
	};

	const handlerDeleteBank = async (deleteIndex) => {
		try {
			if (banks[deleteIndex].image) {
				await handlerDeleteFile(banks[deleteIndex].image.replace(`${process.env.NEXT_PUBLIC_SERVER_URL}`, ""));
			}
			setIsPending(true);
			await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/deleteBank/${banks[deleteIndex].id}`, {
				headers: {
					Authorization: token,
				},
			});
			setBanks((prevState) => prevState.filter((element, index) => index !== deleteIndex));
			dispatch(
				addMessage({
					type: "success",
					text: "Банк удален",
				})
			);
			dispatch(clearInfo());
		} catch (e) {
			console.error(e);
			dispatch(
				addMessage({
					type: "error",
					text: "Не удалось удалить банк",
				})
			);
		} finally {
			setIsPending(false);
		}
	};

	return (
		<div className={`${classes.container} row`}>
			<PlainList
				elements={banks.map((element) => element.name)}
				activeElement={activeBank}
				selectEvent={handlerSelectBank}
				isDeleted={true}
				deleteEvent={handlerDeleteBank}
			/>
			<PlainButton clickEvent={createBank}>
				<span className="plain-text font-medium">Создать банк</span>
			</PlainButton>
			{isPending && <PlainLoader className={classes.loader} />}
		</div>
	);
};

export default BanksControlSide;
