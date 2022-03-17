import { createSlice } from "@reduxjs/toolkit";
import {getCookie, deleteCookie, setCookie} from "~/utils/cookie.utils";
import axios from "axios";

const initialState = {
    isAuth: false,
    managerId: null,
    tokenValue: '',
    role: '',
    allowedRegions: [],
    allowedCities: []
};

export const managerSlice = createSlice({
    name: 'manager',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.isAuth = action.payload
        },
        setManagerId: (state, action) => {
            state.managerId = Number(action.payload)
        },
        setToken: (state, action) => {
            state.tokenValue = action.payload
        },
        setRole: (state, action) => {
            state.role = action.payload
        },
        setAllowedRegions: (state, action) => {
            state.allowedRegions = action.payload
        },
        setAllowedCities: (state, action) => {
            state.allowedCities = action.payload
        },
        logoutManager: (state) => {
            try {
                state.isAuth = false
                state.tokenValue = ''
                state.role = ''
                state.allowedRegions = []
                state.allowedCities = []
                window.location.href = '/'
                deleteCookie('_token')
                deleteCookie('_role')
                deleteCookie('_allowed_cities')
                deleteCookie('_allowed_regions')
            } catch (e) {
                console.error(e)
            }
        }
    }
});

export const { setAuth, setToken, setManagerId, setRole, setAllowedRegions, setAllowedCities, logoutManager } = managerSlice.actions;

export const selectIsAuth = state => state.manager.isAuth;
export const selectIndex = state => state.manager.managerId;
export const selectToken = state => state.manager.tokenValue;
export const selectRole = state => state.manager.role;
export const selectAllowedRegions = state => state.manager.allowedRegions;
export const selectAllowedCities = state => state.manager.allowedCities;

// проверка авторизации менеджера
export const asyncCheckIsAuth = amount => dispatch => {
    try {
        const token = getCookie('_token');
        const role = getCookie('_role');

        if (!token) {
            console.error('token not found');
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }

        if(role === 'advertising-manager') {
            axios.post(`http://localhost:8002/advesting-service/advesting-manager/verify-auth`, {
                token: token.split(' ')[1]
            })
                .then((response) => {
                    if(response.data === true) {
                        dispatch(setAuth(true))
                        // dispatch(setManagerId(id))
                        dispatch(setRole(role))
                        dispatch(setToken(token))
                        // dispatch(setAllowedCities(allowed_cities || []))
                        // dispatch(setAllowedRegions(allowed_regions || []))
                        setCookie('_token', token)
                        setCookie('_role', role)
                        // setCookie('_allowed_cities', allowed_cities || [])
                        // setCookie('_allowed_regions', allowed_regions || [])  
                    }
                })
                .catch(e => {
                    console.error(e)
                    deleteCookie('_token')
                    deleteCookie('_role')
                    deleteCookie('_allowed_cities')
                    deleteCookie('_allowed_regions')
                    dispatch(setAuth(false))
                    dispatch(setRole(''))
                    dispatch(setToken(''))
                    dispatch(setAllowedCities([]))
                    dispatch(setAllowedRegions([]))
                    if (window.location.pathname !== '/') {
                        window.location.href = '/';
                    }
                })
        } else {
            axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/db/${role}/check`, {
                token
            })
                .then((response) => {
                    const { token, allowed_cities, allowed_regions, id } = response.data
                    dispatch(setAuth(true))
                    dispatch(setManagerId(id))
                    dispatch(setRole(role))
                    dispatch(setToken(token))
                    dispatch(setAllowedCities(allowed_cities || []))
                    dispatch(setAllowedRegions(allowed_regions || []))
                    setCookie('_token', token)
                    setCookie('_role', role)
                    setCookie('_allowed_cities', allowed_cities || [])
                    setCookie('_allowed_regions', allowed_regions || [])
                })
                .catch(e => {
                    console.error(e)
                    deleteCookie('_token')
                    deleteCookie('_role')
                    deleteCookie('_allowed_cities')
                    deleteCookie('_allowed_regions')
                    dispatch(setAuth(false))
                    dispatch(setRole(''))
                    dispatch(setToken(''))
                    dispatch(setAllowedCities([]))
                    dispatch(setAllowedRegions([]))
                    if (window.location.pathname !== '/') {
                        window.location.href = '/';
                    }
                })
        }
    } catch (e) {
        console.error(e);
    }
}

export default managerSlice.reducer;