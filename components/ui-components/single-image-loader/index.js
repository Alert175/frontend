import PropTypes from 'prop-types'
import {useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import classes from './single-image-loader.module.scss'
import axios from "axios";

import Arrow from '~/public/Images/UIComponents/FileLoader/arrow.svg'
import PlainLoader from "~/components/ui-components/plain-loader";

import {selectToken} from "~/store/reducers/manager";
import {addMessage} from "~/store/reducers/messages";

const SingleImageLoader = ({label, fileName, pathLoad, urlLoad, imageConfig, loadEvent, isDisabled, className, style}) => {
    const fileInput = useRef()
    const [isLoad, setIsLoad] = useState(false)
    const token = useSelector(selectToken)
    const dispatch = useDispatch()

    const handlerUploadFile = async () => {
        try {
            if (fileInput.current.files.length !== 1) {
                return
            }
            setIsLoad(true)
            const {height, width, fit} = imageConfig
            const fileData = new FormData()
            fileData.append('path', `applications/${pathLoad}`)
            fileData.append('file', fileInput.current.files[0])
            const response = await axios({
                method: 'post',
                url: `${process.env.NEXT_PUBLIC_FILE_STORAGE_URL}/file-service/ftp/upload-file`,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: fileData
            })
            loadEvent({
                url: response.data,
                name: response.data.split('/')[response.data.split('/').length - 1]
            })
            dispatch(addMessage({
                type: 'success',
                text: 'Изображение загружено',
                lifetime: 5
            }));
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'не удалось загрузить изображение',
                lifetime: 5
            }))
        } finally {
            setIsLoad(false)
            fileInput.current.value = ''
        }
    }

    return (
        <div className={`${className} ${classes.container}`}>
            {label && <span className={classes.label}>{label}</span>}
            <label
                className={classes.labelContainer}
                style={{
                    opacity: isDisabled ? '0.5' : '1',
                    ...style
                }}
            >
                {
                    !isLoad
                        ? fileName ? `...${fileName.split('').reverse().join('').slice(0, 12).split('').reverse().join('')}` : <span className={'center-items column'} style={{gap: '10px'}}>Загрузить изображение <Arrow/></span>
                        : <PlainLoader/>
                }
                <input
                    ref={fileInput}
                    disabled={isDisabled || isLoad}
                    className={classes.hideInput}
                    accept="image/*"
                    type="file"
                    onChange={handlerUploadFile}
                />
            </label>
        </div>
    )
}

SingleImageLoader.propTypes = {
    label: PropTypes.string,
    fileName: PropTypes.string,
    pathLoad: PropTypes.string,
    imageConfig: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
        fit: PropTypes.string,
    }),
    loadEvent: PropTypes.func,
    isDisabled: PropTypes.bool,
    urlLoad: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
}

SingleImageLoader.defaultProps = {
    label: '',
    fileName: '',
    pathLoad: '',
    imageConfig: {
        height: 1100,
        width: 1900,
        fit: 'cover',
    },
    loadEvent: Function(),
    isDisabled: false,
    urlLoad: '',
    className: '',
    style: {}
}

export default SingleImageLoader;