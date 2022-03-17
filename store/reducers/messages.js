import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    elements: [
        // {
        //     type: 'info',
        //     text: 'пользователь не найден пользователь не найден пользователь не найден',
        //     lifetime: 5
        // }
    ]
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.elements = [...state.elements, {
                lifetime: 5,
                ...action.payload,
                uuid: uuidv4()
            }]
        },
        deleteMessage: (state, action) => {
            const index = action.payload
            const oldElements = state.elements
            let newElements = []
            for (const element of oldElements) {
                if (element.uuid !== index) {
                    newElements = [...newElements, element]
                }
            }
            state.elements = newElements
        }
    }
});

export const { addMessage, deleteMessage } = messagesSlice.actions;

export const selectMessages = state => state.messages.elements;

export default messagesSlice.reducer;