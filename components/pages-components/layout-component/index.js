import ControlSide from "~/components/pages-components/complex-components/control-side";
import classes from "styles/pages-styles/complex.module.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import PlainList from "~/components/ui-components/list-components/plain-list";
import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import { useSelector } from "react-redux";
import { selectComplexInfo } from "~/store/reducers/complex";

const LayoutComponent = () => {
	const [isPending, setIsPending] = useState(false);
	const [layouts, setLayouts] = useState([]);
	const [activeCianLayout, setActiveCianLayout] = useState(null);

	const complexInfo = useSelector(selectComplexInfo);

	const getNotRecognisedLayouts = async () => {
		try {
			const { data } = await axios.get(
				`${process.env.NEXT_PUBLIC_FILE_STORAGE_URL}/complex-layout/not_recognized_layout-content/get-unique-names`
			);
			setLayouts(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		console.log(layouts);
	}, [layouts]);

	useEffect(() => {
		getNotRecognisedLayouts();
	}, []);

	const onMergeLayouts = async () => {
		try {
			setIsPending(true);
			await axios.post(`${process.env.NEXT_PUBLIC_FILE_STORAGE_URL}/complex-layout/collect-layout/start-linking-layouts`, {
				cian_complex_name: activeCianLayout,
				complex_index: complexInfo.id,
			});
		} catch (e) {
			console.error(e);
		} finally {
			setIsPending(false);
		}
	};

	return (
		<div className={classes.pageContainer}>
			<ControlSide />
			<div className={classes.selectContainer}>
				<PlainList
					label={"Выберите планировку"}
					elements={layouts.map((element) => element)}
					activeElement={
						layouts.findIndex((element) => element === activeCianLayout) !== -1
							? layouts.findIndex((element) => element === activeCianLayout)
							: null
					}
					selectEvent={(value) => setActiveCianLayout(layouts[value])}
				/>
				<PlainButton clickEvent={onMergeLayouts}> Привязать </PlainButton>
				{isPending && <PlainLoader className={classes.selectLoader} />}
			</div>
		</div>
	);
};

export default LayoutComponent;
