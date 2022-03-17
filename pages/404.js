import Link from 'next/link'

const Custom404 = () => {
    return (
        <div className="wrapper">
            <div className="content row">
                Страница не найдена
                <Link href="/complex"> На главную</Link>
            </div>
        </div>
    )
}

export default Custom404;