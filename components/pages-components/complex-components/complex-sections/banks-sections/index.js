import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";
import useAxios from "~/hooks/use-axios.hook";

import {selectAllowedRegions, selectIndex} from "~/store/reducers/manager";
import {selectToken} from "~/store/reducers/manager";
import {addInfo, selectComplexInfo} from "~/store/reducers/complex";
import {addMessage} from "~/store/reducers/messages";

import PlainLoader from "~/components/ui-components/plain-loader";
import MultipleList from "~/components/ui-components/list-components/multiple-list";
import PlainButton from "~/components/ui-components/plain-button";

import objectUtils from 'utils/object.utils'

import axios from "axios";

const BanksSections = () => {
    const regionsAccess = useSelector(selectAllowedRegions)
    const complexInfo = useSelector(selectComplexInfo)
    const token = useSelector(selectToken)
    const managerId = useSelector(selectIndex)
    const dispatch = useDispatch()

    const [banksList, error, loadBanks] = useAxios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/houses/bank/find`,
        method: 'post'
    })

    const [complexBanks, setComplexBanks] = useState([])
    const [selectedBanks, setSelectedBanks] = useState([])
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        handlerSelectedBanks()
    }, [banksList])

    useEffect(() => {
        setSelectedBanks([])
        const { bank_list } = complexInfo;
        if (bank_list) {
            for (const bank of complexInfo.bank_list) {
                if (objectUtils.isIterable(bank)) {
                    setSelectedBanks(prevState => [...prevState, bank.id])
                } else {
                    setSelectedBanks(prevState => [...prevState, bank])
                }
            }
        }
    }, [complexInfo])

    const handlerSelectedBanks = () => {
        if (banksList) {
            setComplexBanks([])
            for (const bankItem of banksList) {
                for (const {region_index} of bankItem.rates) {
                    if (regionsAccess.find(element => element === region_index)) {
                        setComplexBanks(prevState => [...prevState, bankItem])
                        break
                    }
                }
            }
        }
    }

    const handlerUpdateComplex = async () => {
        try {
            setIsPending(true)
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/updateComplex`,
                {
                    id: complexInfo.id,
                    bank_list: [...selectedBanks]
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
                section_name: "bank",
                complex_index: complexInfo.id
            });
            dispatch(addMessage({
                type: 'success',
                text: '???????????? ?????????????? ??????????????????',
                lifetime: 5
            }))
            dispatch(addInfo({bank_list: [...selectedBanks]}))
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

    if (loadBanks) {
        return <PlainLoader/>
    }

    if (!error && banksList.length > 0) {
        return (
            <div className={'plain-row-container plain-container'} style={{maxWidth: '500px'}}>
                <h1 className="header">??????????</h1>
                <MultipleList elements={complexBanks.map(element => ({text: element.name, index: element.id}))}
                              activeElements={selectedBanks}
                              selectEvent={(value) => setSelectedBanks(prev => [...prev, value])}
                              raiseEvent={(value) => setSelectedBanks(prev => prev.filter(element => element !== value))}/>
                <PlainButton clickEvent={handlerUpdateComplex}><span className='plain-text font-medium'>??????????????????</span></PlainButton>
                {isPending && <PlainLoader className='plain-loader'/>}
            </div>
        )
    }

    return null

}

export default BanksSections;