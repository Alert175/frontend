import Logo from "~/public/Images/Header/logo.svg";
import Logout from "~/public/Images/Header/logout.svg";

import classes from "./header.module.scss";

import Link from "next/link";

import { useSelector, useDispatch } from "react-redux";
import { selectIsAuth, selectRole, logoutManager } from "~/store/reducers/manager";
import { useRouter } from "next/router";

// контейнер с общей навигацией
const LinkContainer = () => {
	const managerRole = useSelector(selectRole);
	const dispatch = useDispatch();

	return (
		<div className={classes.linkContainer}>
			{managerRole === "content-manager" ? <ContentManagerLinks /> : null}
			{managerRole === "news-manager" ? <NewsManagerLinks /> : null}
			{managerRole === "advertising-manager" ? <AdvertisingManagerLinks /> : null}
			<span className="plain-text center-items column" style={{ cursor: "pointer", gap: "5px" }} onClick={() => dispatch(logoutManager())}>
				Выйти
				<Logout />
			</span>
		</div>
	);
};

// Навигация для контент менеджера
const ContentManagerLinks = () => {
	const router = useRouter();

	return (
		<>
			<Link href={"/content"}>
				<a
					className={`${classes.linkElement} ${router.pathname === "/content" ? classes.linkActive : ""} plain-text`}
					style={{ cursor: "pointer" }}
				>
					Редактирование контента
				</a>
			</Link>
			<Link href={"/complex"}>
				<a
					className={`${classes.linkElement} ${router.pathname === "/complex" ? classes.linkActive : ""} plain-text`}
					style={{ cursor: "pointer" }}
				>
					Жилой комплекс
				</a>
			</Link>
			<Link href={"/complexes-list"}>
				<a
					className={`${classes.linkElement} ${router.pathname === "/complexes-list" ? classes.linkActive : ""} plain-text`}
					style={{ cursor: "pointer" }}
				>
					Каталог ЖК
				</a>
			</Link>
			<Link href={"/village"}>
				<a
					className={`${classes.linkElement} ${router.pathname === "/village" ? classes.linkActive : ""} plain-text`}
					style={{ cursor: "pointer" }}
				>
					Коттеджный поселок
				</a>
			</Link>
			<Link href={"/developer"}>
				<a
					className={`${classes.linkElement} ${router.pathname === "/developer" ? classes.linkActive : ""} plain-text`}
					style={{ cursor: "pointer" }}
				>
					Застройщик
				</a>
			</Link>
			<Link href={"/banks"}>
				<a
					className={`${classes.linkElement} ${router.pathname === "/banks" ? classes.linkActive : ""} plain-text`}
					style={{ cursor: "pointer" }}
				>
					Банки
				</a>
			</Link>
			<Link href={"/feed"}>
				<a
					className={`${classes.linkElement} ${router.pathname === "/feed" ? classes.linkActive : ""} plain-text`}
					style={{ cursor: "pointer" }}
				>
					Фиды
				</a>
			</Link>
		</>
	);
};

// Навигация для новостного менеджера
const NewsManagerLinks = () => {
	const router = useRouter();

	return (
		<>
			<Link href={"/news"}>
				<a
					className={`${classes.linkElement} ${router.pathname === "/news" ? classes.linkActive : ""} plain-text`}
					style={{ cursor: "pointer" }}
				>
					Новость
				</a>
			</Link>
			<Link href={"/article"}>
				<a
					className={`${classes.linkElement} ${router.pathname === "/article" ? classes.linkActive : ""} plain-text`}
					style={{ cursor: "pointer" }}
				>
					Статья
				</a>
			</Link>
		</>
	);
};

const AdvertisingManagerLinks = () => {
	const router = useRouter();

	return (
		<>
		<Link href={"/advertising-owners"}>
			<a
				className={`${classes.linkElement} ${router.pathname === "/advertising-owners" ? classes.linkActive : ""} plain-text`}
				style={{ cursor: "pointer" }}
			>
				Владельцы рекламы	
			</a>
		</Link>
		<Link href={"/advertising-blocks"}>
			<a
				className={`${classes.linkElement} ${router.pathname === "/advertising-blocks" ? classes.linkActive : ""} plain-text`}
				style={{ cursor: "pointer" }}
			>
				Рекламные блоки	
			</a>
		</Link>
		<Link href={"/advertising-statistics"}>
			<a
				className={`${classes.linkElement} ${router.pathname === "/advertising-statistics" ? classes.linkActive : ""} plain-text`}
				style={{ cursor: "pointer" }}
			>
				Рекламная статистика	
			</a>
		</Link>
		</>
	)
}

const Header = () => {
	const isAuth = useSelector(selectIsAuth);

	return (
		<div className={classes.contentContainer} id="main-header">
			<div className={classes.elementsContainer}>
				<Logo />
				{!isAuth ? "" : <LinkContainer />}
			</div>
			<div className={classes.line} />
		</div>
	);
};

export default Header;
