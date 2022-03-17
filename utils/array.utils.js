class ArrayService {
    // проверка на структуру === массив
    isArray(value) {
        try {
            if (Array.isArray(value)) {
                return true
            }
            return false
        } catch (e) {
            console.error(e)
            return false
        }
    }
    // проверить массив на пустоту
    isNotEmpty(value) {
        try {
            if (this.isArray(value)) {
                for (const valueElement of value) {
                    return true
                }
                return false
            }
            return false
        } catch (e) {
            console.error(e)
            return false
        }
    }
}

export default new ArrayService()