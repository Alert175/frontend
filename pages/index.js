import Logo from '~/public/Images/Header/logo.svg'

import classes from '~/styles/pages-styles/login.module.scss'

import Input from '~/components/ui-components/text-input'
import Button from '~/components/ui-components/plain-button'
import Loader from "~/components/ui-components/plain-loader";

import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import axios from "axios";

import {addMessage} from "~/store/reducers/messages";
import {setToken, setRole, setAuth, setAllowedCities, setAllowedRegions, asyncCheckIsAuth} from "~/store/reducers/manager";
import {setCookie} from "~/utils/cookie.utils";

export default function Home() {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [role, setUserRole] = useState('')
    const [isPending, setIsPending] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(asyncCheckIsAuth())
    }, [])

    const handlerContentManagerLogin = async () => {
        try {
            setIsPending(true)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/content-manager/login`, {
                login,
                password
            })
            dispatch(addMessage({
                type: 'success',
                text: 'пользователь найден',
                lifetime: 5
            }));
            const {allowed_regions, allowed_cities, token} = response.data;
            setCookie('_token', token);
            setCookie('_allowed_regions', allowed_regions);
            setCookie('_allowed_cities', allowed_cities);
            setCookie('_role', 'content-manager');
            dispatch(setRole('content-manager'));
            dispatch(setToken(token));
            dispatch(setAuth(true));
            dispatch(setAllowedCities(allowed_cities));
            dispatch(setAllowedRegions(allowed_regions));
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'пользователь не найден',
                lifetime: 5
            }));
        } finally {
            setIsPending(false)
        }
    }

    const handlerNewsManagerLogin = async () => {
        try {
            setIsPending(true)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/news-manager/login`, {
                login,
                password
            })
            dispatch(addMessage({
                type: 'success',
                text: 'пользователь найден',
                lifetime: 5
            }));
            const {token} = response.data;
            setCookie('_token', token);
            setCookie('_role', 'news-manager');
            dispatch(setRole('news-manager'));
            dispatch(setToken(token));
            dispatch(setAuth(true));
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'пользователь не найден',
                lifetime: 5
            }));
        } finally {
            setIsPending(false)
        }
    }

    const handlerAdvertisingManagerLogin = async () => {
        try {
            setIsPending(true)
            const response = await axios.post(`http://localhost:8002/advesting-service/advesting-manager/login`, {
                login, 
                password
            });
            dispatch(addMessage({
                type: "success",
                text: "пользователь найден",
                lifetime: 5
            }));
            const {result, status} = response.data;
            setCookie('_token', result.token);
            setCookie('_role', 'advertising-manager');
            dispatch(setRole('advertising-manager'));
            dispatch(setToken(result.token));
            dispatch(setAuth(true));
        } catch (e) {
            console.error(e);
            dispatch(addMessage({
                type: "Ошибка",
                text: 'пользователь не найден',
                lifetime: 5
            }));
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="wrapper" style={{minHeight: '80vh'}}>
            <div className={`content row ${classes.contentContainer}`}>
                <Logo/>
                <span className="header">Вход в админ. панель</span>
                <Input
                    styleConfig={{width: '358px'}}
                    label={'Логин'}
                    value={login}
                    changeValue={(value) => setLogin(value)}
                />
                <Input
                    styleConfig={{width: '358px'}}
                    label={'Пароль'}
                    value={password}
                    changeValue={(value) => setPassword(value)}
                />
                <span className="plain-text">Войти как</span>
                <div className={`column ${classes.rolesContainer}`}>
                    <Button
                        styleConfig={{opacity: role === 'news-manager' ? '1' : '0.7'}}
                        clickEvent={() => {
                            setUserRole('news-manager');
                            handlerNewsManagerLogin()
                        }}
                        disabled={!login || !password}
                    >Новостной менеджер</Button>
                    <Button
                        styleConfig={{opacity: role === 'content-manager' ? '1' : '0.7'}}
                        clickEvent={() => {
                            setUserRole('content-manager');
                            handlerContentManagerLogin()
                        }}
                        disabled={!login || !password}
                    >Контент менеджер</Button>
                    <Button
                        styleConfig={{opacity: role === 'advertising-manager' ? '1' : '0.7'}}
                        clickEvent={() => {
                            setUserRole('advertising-manager');
                            handlerAdvertisingManagerLogin()
                        }}
                        disabled={!login || !password}
                    >Рекламный менеджер</Button>
                </div>
            </div>
            {
                isPending
                    ? <Loader styleConfig={{
                        position: 'fixed',
                        top: '0px'
                    }}/>
                    : null
            }
        </div>
    )
}
