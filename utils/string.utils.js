class StringService {
    // перевод в транслит
    convertToTransliteration(value) {
        try {
            const ru = {
                а: 'a',
                б: 'b',
                в: 'v',
                г: 'g',
                д: 'd',
                е: 'e',
                ё: 'e',
                ж: 'j',
                з: 'z',
                и: 'i',
                й: 'i',
                к: 'k',
                л: 'l',
                м: 'm',
                н: 'n',
                о: 'o',
                п: 'p',
                р: 'r',
                с: 's',
                т: 't',
                у: 'u',
                ф: 'f',
                х: 'h',
                ц: 'c',
                ь: '',
                ъ: '',
                ч: 'ch',
                ш: 'sh',
                щ: 'shch',
                ы: 'y',
                э: 'e',
                ю: 'u',
                я: 'ya',
				".": "",
				",": "",
				")": "",
				"(": "",
            }
            const rusultValue = []
            value = value.replace(/[ъь]+/g, '').replace(/й/g, 'i')
            for (let i = 0; i < value.length; ++i) {
                rusultValue.push(
                    ru[value[i]] ||
                    (ru[value[i].toLowerCase()] === undefined && value[i]) ||
                    ru[value[i].toLowerCase()].toUpperCase()
                )
            }
            return rusultValue.join('').split(' ').join('_')
        } catch (error) {
            console.error(error)
            return null
        }
    }
    // проверка на не пустоту
    containsSymbols(value) {
        for (const valueElement of value) {
            if (isNaN(Number(valueElement))) {
                return true
            }
        }
        return false
    }
    // приведение к валидному url
    urlValidator(value) {
        try {
            let result = ''
            const regulations = ['.', '"', '\'', ' ', '+', '-', '?', '#', '=', '&', '–', '»', '«', '%']
            for (const element of value) {
                let tempElement = ''
                for (const regulation of regulations) {
                    if (element === regulation) {
                        tempElement += '_'
                    }
                }
                result += tempElement ? tempElement : element
            }
            return result
        } catch (e) {
            console.error(e)
            return undefined
        }
    }
    // приведение html к обычной строке
    htmlToStingParser(value) {
        try {
            return value.replace(/<|>|span|br|class="ql-align-justify"|strong|p|\/span|\/p|\/strong|\/br|\/class="ql-align-justify"/g, '')
        } catch (e) {
            return ''
        }
    }
}

export default new StringService()