import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";

import {addInfo, selectVillageInfo} from "~/store/reducers/village";
import {selectIndex, selectToken} from "~/store/reducers/manager";
import {addMessage} from "~/store/reducers/messages";

import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import PlainTextarea from "~/components/ui-components/plain-textarea";
import TextEditor from "~/components/ui-components/text-editor";
import PlainList from "~/components/ui-components/list-components/plain-list";

import classes from './payment-section.module.scss'

import axios from "axios";

const PaymentsSection = () => {
    const dispatch = useDispatch()
    const token = useSelector(selectToken)
    const managerId = useSelector(selectIndex)
    const villageInfo = useSelector(selectVillageInfo)

    const [text, setText] = useState('')
    const [newElement, setNewElement] = useState('')
    const [elements, setElements] = useState([])
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        const {payment_text, payment_methods} = villageInfo
        setText(payment_text || '')
        setElements(payment_methods || [])
    }, [villageInfo])

    const deleteElement = (index) => {
        let result = []
        for (const [id, element] of elements.entries()) {
            if (id !== index) {
                result = [...result, element]
            }
        }
        setElements(result)
    }

    const addElement = () => {
        setElements(prevState => [...prevState, newElement])
        setNewElement('')
    }

    const updatePaymentsData = async () => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateVillage`,
                {
                    id: villageInfo.id,
                    payment_text: text,
                    payment_methods: [...elements]
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/add-action`, {
                content_manager_index: managerId,
                action_type: "update",
                section_name: "payment",
                village_index: villageInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: '???????????? ?????????????? ??????????????????',
                lifetime: 5
            }))
            dispatch(addInfo({
                payment_text: text,
                payment_methods: [...elements]
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
        <div className={`${classes.container} row`}>
            <h1 className='header'>?????????????? ????????????</h1>
            <div className={`${classes.containerControl} column`}>
                <TextEditor
                    value={text}
                    changeEvent={(value) => setText(value)}
                    style={{border: text === '<p><br></p>' || !text ? '1px solid red' : '1px solid black'}}
                />
                <div className={`${classes.containerElements} row`}>
                    <PlainList
                        elements={elements}
                        isDeleted={true}
                        deleteEvent={deleteElement}
                        label={'????????????????'}
                        style={{border: elements.length < 1 ? '1px solid red' : '1px solid black'}}
                    />
                    <PlainTextarea value={newElement} changeValue={(value) => setNewElement(value)} holder={'???????????????? ????????????'} />
                    <PlainButton styleConfig={{width: '350px'}} disabled={!newElement} clickEvent={addElement}>
                        <span className='plain-text font-medium'>????????????????</span>
                    </PlainButton>
                </div>
            </div>
            <PlainButton styleConfig={{width: '350px'}} disabled={text === '<p><br></p>' || !text || elements.length === 0} clickEvent={updatePaymentsData}>
                <span className='plain-text font-medium'>??????????????????</span>
            </PlainButton>
            {isPending && <PlainLoader className={classes.loader}/>}
        </div>
    )
}

export default PaymentsSection;