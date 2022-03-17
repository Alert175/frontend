import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import PropTypes from 'prop-types'

import 'react-quill/dist/quill.snow.css';

const TextEditor = ({value, changeEvent, style}) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'align': ['', 'center', 'right', 'justify'] }],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ],
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline',
        'align',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]
    return(
        <div style={{
            display: 'grid',
            placeContent: 'stretch',
            borderRadius: 20,
            ...style
        }}>
            <ReactQuill
                value={value}
                onChange={changeEvent}
                modules={modules}
                formats={formats}
                placeholder={'Введите текст'}
            />
        </div>
    )
};

TextEditor.propTypes = {
    value: PropTypes.string,
    changeEvent: PropTypes.func,
}

TextEditor.defaultProps = {
    value: '',
    changeEvent: Function(),
}

export default TextEditor;