import {useState, useEffect} from "react";
import {useSelector, useDispatch} from 'react-redux';

import {selectComplexInfo} from "~/store/reducers/complex";
import {addInfo} from "~/store/reducers/complex";
import {addMessage} from "~/store/reducers/messages";
import {selectIndex, selectToken} from "~/store/reducers/manager";

import PlainButton from "~/components/ui-components/plain-button";
import PlainLoader from "~/components/ui-components/plain-loader";
import TextInput from "~/components/ui-components/text-input";

import axios from "axios";

const ContactSection = () => {
    const dispatch = useDispatch()
    const complexInfo = useSelector(selectComplexInfo)
    const token = useSelector(selectToken)
    const managerId = useSelector(selectIndex)

    const [isPending, setIsPending] = useState(false);

    const [locationCoordinates, setLocationCoordinates] = useState([0, 0]);
    const [complexPhone, setDeveloperPhone] = useState('');
    const [complexEmail, setDeveloperEmail] = useState('');
    const [complexAddress, setDeveloperAddress] = useState('');


    useEffect(() => {
        const {coordinates, phone, email, address} = complexInfo
        setLocationCoordinates(coordinates || [0, 0]);
        setDeveloperPhone(phone || '');
        setDeveloperEmail(email || '');
        setDeveloperAddress(address || '');
    }, []);

    const updateContactData = async () => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateComplex`,
                {
                    id: complexInfo.id,
                    coordinates: [0, 0],
                    phone: complexPhone,
                    email: complexEmail,
                    address: complexAddress
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/add-action`, {
                content_manager_index: managerId,
                action_type: "update",
                section_name: "contact",
                complex_index: complexInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: '???????????? ?????????????? ??????????????????',
                lifetime: 5
            }))
            dispatch(addInfo({
                coordinates: [0, 0],
                phone: complexPhone,
                email: complexEmail,
                address: complexAddress
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: '?????????????????? ???????????? ?????? ???????????????????? ????????????',
                lifetime: 5
            }))
        } finally {
            setIsPending(false)
        }
    }

    return(
        <div className={'plain-container plain-row-container'}>
            <h1 className="header">????????????????</h1>
            <div className="plain-column-container">
                <TextInput label={'?????????? ???????????????????????? ??????????'} value={complexAddress} changeValue={(value) => setDeveloperAddress(value)}
                           style={{border: complexAddress === '' ? '1px solid red' : '1px solid black'}}/>
                <TextInput label={'?????????? ????????????????'} value={complexPhone} changeValue={(value) => setDeveloperPhone(value)}/>
                <TextInput label={'??????????'} value={complexEmail} changeValue={(value) => setDeveloperEmail(value)}
                           style={{border: complexEmail === '' ? '1px solid red' : '1px solid black'}}/>
            </div>
            <PlainButton className={'plain-button'} disabled={!complexEmail || !complexAddress} clickEvent={updateContactData}>
                <span className="plain-text">
                    ??????????????????
                </span>
            </PlainButton>
            {isPending && <PlainLoader className={'plain-loader'}/>}
        </div>
    )

};

export default ContactSection;