import FeedComponent from "~/components/pages-components/feed-components";
import {useState} from "react";
import LayoutComponent from "~/components/pages-components/layout-component";
import classes from "styles/pages-styles/complex.module.scss";

const FeedPage = () => {

	const [isFeed, setIsFeed] = useState(true)

	const onChangeFeed = () => {
		setIsFeed(true)
	}

	const onChangeLayouts = () => {
		setIsFeed(false)
	}


	return (

		<>
			<div className={classes.toggle}>

				<button
					className={classes.button}
					onClick={onChangeFeed}
				>
					Фиды
				</button>

				<button
					className={classes.button}
					onClick={onChangeLayouts}
				>
					Планировки
				</button>

			</div>

			{
				isFeed ? <FeedComponent/> : <LayoutComponent/>
			}


		</>
	);
};

export default FeedPage;
