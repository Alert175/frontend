export const getCookie = (name) => {
    try {
        if (document) {
            const matches = document.cookie.match(
                // eslint-disable-next-line
                new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
            )
            return matches ? JSON.parse(matches[1]) : undefined
        }
        return undefined
    } catch (error) {
        if (error.message === 'document is not defined') {
            return undefined
        }
        // eslint-disable-next-line
        console.error(error);
        return undefined
    }
}

export const setCookie = (name, value, options = {}) => {
    try {
        if (document) {
            options = {
                path: '/',
                ...options
            }

            let updatedCookie = String(name) + '=' + JSON.stringify(value)

            for (const optionKey in options) {
                updatedCookie += '; ' + optionKey
                const optionValue = options[optionKey]
                if (optionValue !== true) {
                    updatedCookie += '=' + optionValue
                }
            }

            document.cookie = updatedCookie
        }
    } catch (error) {
        if (error.message === 'document is not defined') {
            return undefined
        }
        // eslint-disable-next-line
        console.error(error);
        return undefined
    }
}

export const deleteCookie = (name) => {
    try {
        setCookie(name, '', {
            'max-age': -1
        })
    } catch (error) {
        if (error.message === 'document is not defined') {
            return undefined
        }
        // eslint-disable-next-line
        console.error(error);
    }
}