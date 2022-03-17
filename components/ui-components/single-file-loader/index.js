import PropTypes from 'prop-types'
import {useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import classes from './single-file-loader.module.scss'
import axios from "axios";

import Arrow from '~/public/Images/UIComponents/FileLoader/arrow.svg'
import PlainLoader from "~/components/ui-components/plain-loader";

import {selectRole, selectToken} from "~/store/reducers/manager";
import {addMessage} from "~/store/reducers/messages";

const SingleFileLoader = ({label, fileName, urlLoad, pathLoad, loadEvent, isDisabled}) => {
    const fileInput = useRef()
    const [isLoad, setIsLoad] = useState(false)
    const role = useSelector(selectRole)
    const token = useSelector(selectToken)
    const dispatch = useDispatch()

    const handlerUploadFile = async () => {
        try {
            if (fileInput.current.files.length !== 1) {
                return
            }
            setIsLoad(true)
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
                text: 'файл загружен',
                lifetime: 5
            }))
        } catch (e) {
            console.error(e)
            dispatch(addMessage({
                type: 'error',
                text: 'не удалось загрузить файл',
                lifetime: 5
            }))
        } finally {
            setIsLoad(false)
        }
    }

    return (
        <div className={classes.container}>
            {label && <span className={classes.label}>{label}</span>}
            <label
                className={classes.labelContainer}
                style={{
                    opacity: isDisabled ? '0.5' : '1'
                }}
            >
                {
                    !isLoad
                        ? fileName || <span className={'center-items column'} style={{gap: '10px'}}>Загрузить файл <Arrow/></span>
                        : <PlainLoader/>
                }
                <input
                    ref={fileInput}
                    disabled={isDisabled || isLoad}
                    className={classes.hideInput}
                    type="file"
                    onChange={handlerUploadFile}
                />
            </label>
        </div>
    )
}

SingleFileLoader.propTypes = {
    label: PropTypes.string,
    fileName: PropTypes.string,
    pathLoad: PropTypes.string,
    urlLoad: PropTypes.string,
    loadEvent: PropTypes.func,
    isDisabled: PropTypes.bool
}

SingleFileLoader.defaultProps = {
    label: '',
    fileName: '',
    urlLoad: '',
    pathLoad: '',
    loadEvent: Function(),
    isDisabled: false
}

export default SingleFileLoader;