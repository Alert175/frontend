import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {selectIndex, selectToken} from "~/store/reducers/manager";
import {addInfo, selectDeveloperInfo} from "~/store/reducers/developer";
import {addMessage} from "~/store/reducers/messages";

import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import TextInput from "~/components/ui-components/text-input";

import axios from "axios";

const ContactSection = () => {
    const token = useSelector(selectToken)
    const developerInfo = useSelector(selectDeveloperInfo)
    const dispatch = useDispatch()
    const managerId = useSelector(selectIndex)

    const [isPending, setIsPending] = useState(false);

    const [locationCoordinates, setLocationCoordinates] = useState([0, 0]);
    const [developerPhone, setDeveloperPhone] = useState('');
    const [developerEmail, setDeveloperEmail] = useState('');
    const [developerAddress, setDeveloperAddress] = useState('');


    useEffect(() => {
        const {coordinates, phone, email, address} = developerInfo
        setLocationCoordinates(coordinates || [0, 0]);
        setDeveloperPhone(phone || '');
        setDeveloperEmail(email || '');
        setDeveloperAddress(address || '');
    }, [developerInfo]);

    const updateContactData = async () => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateDeveloper`,
                {
                    id: developerInfo.id,
                    coordinates: [0, 0],
                    phone: developerPhone,
                    email: developerEmail,
                    address: developerAddress
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            dispatch(addInfo({
                coordinates: [0, 0],
                phone: developerPhone,
                email: developerEmail,
                address: developerAddress
            }))
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/add-action`, {
                content_manager_index: managerId,
                action_type: "update",
                section_name: "contact",
                developer_index: developerInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: 'Данные успешно обновлены',
                lifetime: 5
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'Произошла ошибка при обновлении данных',
                lifetime: 5
            }))
        } finally {
            setIsPending(false)
        }
    }

    return(
        <div className={'plain-container plain-row-container'}>
            <h1 className="header">Контакты</h1>
            <div className="plain-column-container">
                <TextInput label={'Адрес центрального офиса'} value={developerAddress} changeValue={(value) => setDeveloperAddress(value)}
                           style={{border: developerAddress === '' ? '1px solid red' : '1px solid black'}}/>
                <TextInput label={'Номер телефона'} value={developerPhone} changeValue={(value) => setDeveloperPhone(value)}
                           style={{border: developerPhone === '' ? '1px solid red' : '1px solid black'}}/>
                <TextInput label={'Почта'} value={developerEmail} changeValue={(value) => setDeveloperEmail(value)}
                           style={{border: developerEmail === '' ? '1px solid red' : '1px solid black'}}/>
            </div>
            <PlainButton className={'plain-button'} disabled={!developerEmail || !developerAddress || !developerInfo} clickEvent={updateContactData}>
                <span className="plain-text">
                    Сохранить
                </span>
            </PlainButton>
        </div>
    )

};

export default ContactSection;