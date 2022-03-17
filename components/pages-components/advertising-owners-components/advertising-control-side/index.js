import {useEffect, useState } from "react";
import  { useDispatch, useSelector } from "react-redux";
import { asyncCheckIsAuth, selectToken } from "~/store/reducers/manager";
import { addMessage } from "~/store/reducers/messages";
import { addInfo, clearInfo } from "~/store/reducers/advertising-owner";
import SingleList from "~/components/ui-components/list-components/single-list";
import classes from './advertising-control-side.module.scss';
import axios from "axios";
import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import PlainList from "~/components/ui-components/list-components/plain-list";

const AdvertisingOwnerControlSide = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);

    const [activeOwner, setActiveOwner] = useState(null);
    const [owners, setOwners] = useState([]);
    const [isPendingOwners, setIsPendingOwners] = useState(false);

    const getOwners =  async () => {
        try {
            setIsPendingOwners(true)
            const response = await axios.get(`http://localhost:8002/advesting-service/advesting-owner/get-owner`)

            if (response.data.result.length === 0) {
                throw new Error('not found owners')
            }
            setOwners(response.data.result)
            dispatch(addMessage({
                type: 'success',
                text: 'Владельцы получены',
                lifetime: 5
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'Не удалось загрузить владельцев',
                lifetime: 5
            }))
        } finally {
            setIsPendingOwners(false)
        }
    }

    useEffect(() => {
        dispatch(asyncCheckIsAuth());
        getOwners();
    },[])

    const handlerSelectOwner = (index) => {
		if (index === null) {
			return;
		}
		setActiveOwner(index);
		dispatch(clearInfo());
		dispatch(addInfo(owners[index]));
		dispatch(
			addMessage({
				type: "info",
				text: `Выбран владелец ${owners[index].name}`,
			})
		);
	};

	const createOwner = async () => {
		try {
			setIsPendingOwners(true);
			const response = await axios.post(
				`http://localhost:8002/advesting-service/advesting-owner/create-owner`,
				{ name: "New owner" },
				{
					headers: {
						Authorization: token,
					},
				}
			);
			setActiveOwner(null);
			setOwners((prevState) => [...prevState, response.data.result]);
			dispatch(
				addMessage({
					type: "success",
					text: "Владелец создан",
				})
			);
		} catch (e) {
			console.error(e);
			dispatch(
				addMessage({
					type: "error",
					text: "Не удалось создать владельца",
				})
			);
		} finally {
			setIsPendingOwners(false);
		}
	};

	const handlerDeleteOwner = async (deleteIndex) => {
		try {
			setIsPendingOwners(true);
			await axios.delete(`http://localhost:8002/advesting-service/advesting-owner/${owners[deleteIndex].id}`, {
				headers: {
					Authorization: token,
				},
			});
			setOwners((prevState) => prevState.filter((element, index) => index !== deleteIndex));
			dispatch(
				addMessage({
					type: "success",
					text: "Владелец удален",
				})
			);
			dispatch(clearInfo());
		} catch (e) {
			console.error(e);
			dispatch(
				addMessage({
					type: "error",
					text: "Не удалось удалить владельца",
				})
			);
		} finally {
			setIsPendingOwners(false);
		}
	};

    return (
        <div className={`${classes.container} row`}>
            <PlainList
                        elements={owners.map(element => element.name)}
                        activeElement={activeOwner}
                        selectEvent={handlerSelectOwner}
                        deleteEvent={handlerDeleteOwner}
                        label={'Владельцы рекламы'}
                        isDisabled={owners.length === 0}
                        isDeleted={true}
            />
            <PlainButton clickEvent={createOwner}>
                <span className="plain-text font-medium">Создать владельца</span>
            </PlainButton>
            {isPendingOwners && <PlainLoader className={classes.loader} />}
        </div>
    )
}

export default AdvertisingOwnerControlSide;