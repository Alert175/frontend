import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";

import {selectToken} from "~/store/reducers/manager";
import {selectActiveNews, setActiveNewsData} from "~/store/reducers/news";
import {addMessage} from "~/store/reducers/messages";

import PlainLoader from "~/components/ui-components/plain-loader";
import PlainButton from "~/components/ui-components/plain-button";
import SingleImageLoader from "~/components/ui-components/single-image-loader";

import axios from "axios";

const ImagesInfo = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const newsData = useSelector(selectActiveNews);

    const [content, setContent] = useState('');

    const [isPending, setIsPending] = useState(false);

    return(
        <div className="plain-container">
            <h1 className="header">Фотогалерея</h1>
        </div>
    )
}

export default ImagesInfo;