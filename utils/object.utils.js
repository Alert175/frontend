import arrayService from './array.utils'

class ObjectService {
    // проверка объекта на итерабельность
    isIterable(object = {}) {
        try {
            if (typeof object !== 'object') {
                return false;
            }
            for (const key in object) {
                if (Object.hasOwnProperty.call(object, key)) {
                    return true
                }
            }
            return false
        } catch (e) {
            console.error(e)
            return false
        }
    }

    // вернуть объект без поля
    overloadWithoutField(field = '', iterableObject) {
        try {
            let args = {};
            // если объект не итерабельный, то верну пустой объект
            if (!this.isIterable(iterableObject)) {
                return args
            }
            // пересобираю объект без нужного поля
            for (const key in iterableObject) {
                if (Object.hasOwnProperty.call(iterableObject, key) && key !== field) {
                    args = {...args, [key]: iterableObject[key]};
                }
            }
            return args;
        } catch (error) {
            console.error(error);
            return {};
        }
    }

    // вернуть объект без полей
    overloadWithoutListFields(fields = [], iterableObject) {
        try {
            let tempSliceObject = [{...iterableObject}]
            if (!arrayService.isNotEmpty(fields)) {
                return {}
            }
            if (!this.isIterable(iterableObject)) {
                return {}
            }
            for (const fieldElement of fields) {
                tempSliceObject = [...tempSliceObject, {...this.overloadWithoutField(fieldElement, tempSliceObject[tempSliceObject.length - 1])}]
            }
            return tempSliceObject[tempSliceObject.length - 1];
        } catch (e) {
            console.error(e)
            return {}
        }
    }
}

export default new ObjectService()