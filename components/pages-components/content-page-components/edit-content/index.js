import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PlainList from "~/components/ui-components/list-components/plain-list";
import { selectActivePage, selectActiveSubDomainIndex, setActivePage, setActiveSubdomainIndex, setContentList } from "~/store/reducers/content";

const pagesList = ["Главная страница", "Страница новостроек", "Страница застройщиков", "Страница фильтра планировок", "Страница журнал"];

export default function EditContent() {
	const activeSubDomainIndex = useSelector(selectActiveSubDomainIndex);
	const activePage = useSelector(selectActivePage);
	const dispatch = useDispatch();

	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [subDomainList, setSubDomainList] = useState([]);

	const getContentList = async () => {
		try {
			setIsPending(true);
			const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/header/get-headers`);
			dispatch(setContentList(data));
		} catch (error) {
			setIsError(true);
		} finally {
			setIsPending(false);
		}
	};

	const getSubDomainList = async () => {
		try {
			setIsPending(true);
			const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/subdomain/`);
			if (!Array.isArray(data));
			setSubDomainList([
				// вставляю основной домен, чтобы можно было редактировать контент основного домена
				{
					city_index: 0,
					id: 0,
					name: "Основной домен",
					region_index: 0,
					sub_domain_name: "main",
				},
				...data,
			]);
		} catch (error) {
			console.error(error);
			setIsError(true);
		} finally {
			setIsPending(false);
		}
	};

	useEffect(() => {
		getContentList();
		getSubDomainList();
	}, []);

	if (!isError) {
		return (
			<div className="row plain-gap">
				<PlainList
					label={"Выберите поддомен"}
					elements={subDomainList.map((element) => element.name)}
					activeElement={subDomainList.findIndex((element) => element.id === activeSubDomainIndex)}
					selectEvent={(value) => dispatch(setActiveSubdomainIndex(value !== null ? subDomainList[value].id : null))}
				/>
				<PlainList
					label={"Выберите страницу"}
					elements={pagesList}
					activeElement={activePage}
					selectEvent={(index) => dispatch(setActivePage(index))}
				/>
			</div>
		);
	}

	return null;
}
