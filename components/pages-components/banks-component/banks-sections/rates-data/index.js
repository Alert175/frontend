import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { selectBankInfo } from "~/store/reducers/bank";
import { addMessage } from "~/store/reducers/messages";
import { addInfo } from "~/store/reducers/bank";
import { selectAllowedRegions, selectToken } from "~/store/reducers/manager";

import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import TextInput from "~/components/ui-components/text-input";
import NumberInput from "~/components/ui-components/number-input";
import PlainList from "~/components/ui-components/list-components/plain-list";
import SingleSelect from "~/components/ui-components/single-select";
import MultipleList from "~/components/ui-components/list-components/multiple-list";

import classes from "styles/pages-styles/banks.module.scss";
import localClasses from "./general-data.module.scss";

import useAxios from "~/hooks/use-axios.hook";

import axios from "axios";
import PlainTextarea from "~/components/ui-components/plain-textarea";

const RatesData = () => {
	const bankInfo = useSelector(selectBankInfo);
	const allowedRegions = useSelector(selectAllowedRegions);
	const token = useSelector(selectToken);
	const dispatch = useDispatch();

	const [isPending, setIsPending] = useState(false);
	const [bankPrograms, setBankPrograms] = useState([]);
	const [activeProgram, setActiveProgram] = useState(null);

	const [activeRegion, setActiveRegion] = useState(null);

	const [regionIndexes, setRegionIndexes] = useState([]);
	const [description, setDescription] = useState("");
	const [initialFee, setInitialFee] = useState(0);
	const [periodFrom, setPeriodFrom] = useState(0);
	const [periodTo, setPeriodTo] = useState(0);
	const [rate, setRate] = useState(0);

	const [regions, error, isLoading] = useAxios({
		url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/region/filter`,
		method: "post",
		body: JSON.stringify({ id: allowedRegions }),
	});

	/**
	 * Запросить программы банка
	 */
	const getPrograms = async () => {
		try {
			setIsPending(true);
			const {
				data: { currentList },
			} = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/mortgage/filter`, {
				bank_id: bankInfo.id,
				groupLimit: 1000,
				diffValue: 0,
			});
			setBankPrograms(currentList || []);
			dispatch(addMessage({ type: "success", text: "Программы загружены" }));
		} catch (error) {
			dispatch(addMessage({ type: "error", text: "Не удалось получить программы" }));
		} finally {
			setIsPending(true);
		}
	};

	useEffect(() => {
		getPrograms();
	}, [bankInfo]);

	/**
	 * Создать пустую ипотечную программу
	 */
	const createProgram = async () => {
		try {
			setIsPending(true);
			await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/mortgage/create`,
				{
					bank_id: bankInfo.id,
					description: "Пустая программа",
				},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			dispatch(addInfo({}));
			dispatch(addMessage({ type: "success", text: "Программа создана" }));
		} catch (e) {
			console.error(e);
			dispatch(addMessage({ type: "error", text: "Не удалось добавить ставку" }));
		} finally {
			setIsPending(false);
		}
	};

	const deleteProgram = async (deleteIndex = 0) => {
		try {
			setIsPending(true);
			await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/mortgage/${bankPrograms[deleteIndex].id}`, {
				headers: {
					Authorization: token,
				},
			});
			setActiveProgram(null);
			dispatch(addInfo({}));
			setBankPrograms((prevState) => prevState.filter((element, index) => index !== deleteIndex));
			dispatch(addMessage({ type: "success", text: "Программа удалена" }));
		} catch (e) {
			console.error(e);
			dispatch(addMessage({ type: "error", text: "Не удалось удалить программу" }));
		} finally {
			setIsPending(false);
		}
	};

	const updateProgram = async () => {
		try {
			setIsPending(true);
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/mortgage/update`,
				{
					id: bankPrograms[activeProgram].id,
					description,
					initial_fee: initialFee,
					period_from: periodFrom,
					period_to: periodTo,
					rate: Number(rate),
					region_indexes: regionIndexes,
				},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			setActiveProgram(null);
			dispatch(addInfo({}));
			dispatch(addMessage({ type: "success", text: "Программа обновлена" }));
		} catch (e) {
			console.error(e);
			dispatch(addMessage({ type: "error", text: "Не удалось обновить программу" }));
		} finally {
			setIsPending(false);
		}
	};

	/**
	 * Добавление / удаление региона из списка регионов ипотечной программы
	 * @param {*} index
	 * @returns
	 */
	const changeRegionIndexes = (index) => {
		if (!regionIndexes.find((element) => element === index)) {
			setRegionIndexes((prevState) => [...prevState, index]);
			return;
		}
		setRegionIndexes((prevState) => prevState.filter((element) => element !== index));
	};

	/**
	 * Сброс / установка данных по выбранной ипотечной программы
	 */
	useEffect(() => {
		if (activeProgram === null) {
			setRegionIndexes([]);
			setDescription("");
			setInitialFee(0);
			setPeriodFrom(0);
			setPeriodTo(0);
			setRate(0);
			return;
		}
		setRegionIndexes(bankPrograms[activeProgram].region_indexes || []);
		setDescription(bankPrograms[activeProgram].description || "");
		setInitialFee(bankPrograms[activeProgram].initial_fee || 0);
		setPeriodFrom(bankPrograms[activeProgram].period_from || 0);
		setPeriodTo(bankPrograms[activeProgram].period_to || 0);
		setRate(bankPrograms[activeProgram].rate || 0);
	}, [activeProgram]);

	return (
		<div className={`${classes.sectionContainer} plain-row-container`}>
			<h1 className="header">Ипотечные программы</h1>
			<div className={`${localClasses.container} column`}>
				<div className="plain-row-container">
					<PlainList
						elements={bankPrograms.map((element) => element.description) || []}
						isDeleted={true}
						activeElement={activeProgram}
						selectEvent={setActiveProgram}
						label={"Ипотечные программы банка"}
						deleteEvent={deleteProgram}
					/>
					<PlainButton disabled={activeProgram !== null} clickEvent={createProgram}>
						Добавить ставку
					</PlainButton>
					<PlainButton
						disabled={activeProgram === null || !description || !rate || !regionIndexes.length  || !periodTo || !periodFrom}
						clickEvent={updateProgram}
					>
						Сохранить изменения
					</PlainButton>
				</div>
				<div className="plain-row-container">
					{Array.isArray(regions) && regions.length > 0 && (
						<MultipleList
							label={"Выберите регионы для программы"}
							elements={regions.map((region) => ({ index: region.id, text: region.name }))}
							activeElements={regionIndexes}
							selectEvent={changeRegionIndexes}
							raiseEvent={changeRegionIndexes}
							isDisabled={activeProgram === null}
						/>
					)}
					<PlainTextarea label={"Текст программы"} value={description} changeValue={setDescription} isDisabled={activeProgram === null} />
					<NumberInput
						label={"Первоначальный взнос %"}
						value={initialFee}
						changeValue={setInitialFee}
						isDisabled={activeProgram === null}
					/>
					<NumberInput label={"Срок ипотеки от"} value={periodFrom} changeValue={setPeriodFrom} isDisabled={activeProgram === null} />
					<NumberInput label={"Срок ипотеки до"} value={periodTo} changeValue={setPeriodTo} isDisabled={activeProgram === null} />
					<NumberInput label={"Процентная ставка"} value={rate} changeValue={setRate} isDisabled={activeProgram === null} />
				</div>
			</div>
			{(isLoading || isLoading) && <PlainLoader className={classes.loader} />}
		</div>
	);
};

export default RatesData;
