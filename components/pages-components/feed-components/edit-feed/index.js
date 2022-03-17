import axios from "axios";
import { element } from "prop-types";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PlainList from "~/components/ui-components/list-components/plain-list";
// import { selectActiveSubDomainIndex, setActiveSubdomainIndex, setContentList } from "~/store/reducers/content";
import { selectActiveTypeFeed, setActiveTypeFeed } from "~/store/reducers/feed";

export default function EditFeed() {
	const activeTypeFeed = useSelector(selectActiveTypeFeed);
	const dispatch = useDispatch();

	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const typeList = ["Cian", "Yandex"];

	// const getContentList = async () => {
	//     try {
	//         setIsPending(true);
	//         const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/header/get-headers`);
	//         dispatch(setContentList(data));
	//     } catch (error) {
	//         setIsError(true);
	//     } finally {
	//         setIsPending(false);
	//     }
	// };

	// const getSubDomainList = async () => {
	//     try {
	//         setIsPending(true);
	//         const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/subdomain/`);
	//         if (!Array.isArray(data));
	//         setSubDomainList(data);
	//     } catch (error) {
	//         console.error(error);
	//         setIsError(true);
	//     } finally {
	//         setIsPending(false);
	//     }
	// };

	// useEffect(() => {
	//     getContentList();
	//     getSubDomainList();
	// }, []);
	if (!isError) {
		return (
			<PlainList
				label={"Выберите тип фида"}
				elements={typeList.map((element) => element)}
				activeElement={
					typeList.findIndex((element) => element === activeTypeFeed) !== -1
						? typeList.findIndex((element) => element === activeTypeFeed)
						: null
				}
				selectEvent={(value) => dispatch(setActiveTypeFeed(typeList[value]))}
			/>
		);
	}

	return null;
}
