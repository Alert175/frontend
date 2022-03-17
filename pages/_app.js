// styles
import '../styles/reset.scss'
import '~/styles/template.scss'
import '~/styles/variables.scss'
import '~/components/ui-components/text-editor/text-editor.scss'

// redux
import {store} from '~/store'
import {Provider} from 'react-redux'

// Next components
import Head from "next/head";

// Components
import Header from "~/components/general-components/header";
import Footer from "~/components/general-components/footer";
import MessagesList from "~/components/general-components/messages-list";

function MyApp({Component, pageProps}) {

    return (
        <Provider store={store}>
            <Head>
                <title>Админ панель</title>
                <meta name="description" content="Admin Panel"/>
                <meta name="robots" content="noindex"/>
                <link rel="icon" href="/favicon.ico"/>
                <meta charSet="utf-8"/>
            </Head>
            <div className="wrapper">
                <div className="content">
                    <Header/>
                    <MessagesList/>
                    <Component {...pageProps} />
                    <Footer/>
                </div>
            </div>
        </Provider>
    )
}

export default MyApp
