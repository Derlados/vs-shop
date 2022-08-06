import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useState } from 'react';
import './pagination.scss';

interface PaginationProps {
    pageWindow?: number;
    maxPages: number;
    currentPage: number;
    back: () => void;
    next: () => void;
    setPage: (page: number) => void;
}

const Pagination: FC<PaginationProps> = observer(({ pageWindow = 9, maxPages, currentPage, back, next, setPage }) => {
    const [pages, setPages] = useState<Array<string>>([]);

    useEffect(() => {
        let pages: Array<string> = Array.from(Array(maxPages).keys()).map(i => (i + 1).toString());
        if (maxPages <= 9) {
            setPages(pages);
            return;
        }

        const currentPageIndex = pages.findIndex(p => p === currentPage.toString());
        let leftIndex = currentPageIndex - Math.floor(pageWindow / 2);
        let rightIndex = currentPageIndex + Math.floor(pageWindow / 2) + 1;

        if (leftIndex < 0) {
            const correction = Math.abs(leftIndex);
            leftIndex += correction;
            rightIndex += correction;
        }

        if (rightIndex > pages.length) {
            const correction = rightIndex - pages.length;
            leftIndex -= correction;
            rightIndex -= correction;
        }

        pages = pages.slice(leftIndex, rightIndex);
        pages[0] = '1';
        pages[pages.length - 1] = maxPages.toString();

        if (pages[1] !== '2') {
            pages[1] = '...';
        }

        if (pages[pages.length - 2] !== (maxPages - 1).toString()) {
            pages[pages.length - 2] = '...';
        }


        setPages(pages);
    }, [currentPage, maxPages, pageWindow]);

    const onClickPage = (page: string) => {
        if (page !== '...') {
            setPage(+page);
            scrollTop();
        }
    }

    const onBack = () => {
        back();
        scrollTop();
    }

    const onNext = () => {
        next();
        scrollTop();
    }

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "auto"
        })
    }

    return (
        <ul className='pagination rcc'>
            <li className='pagination__arrow pagination__item' onClick={onBack}>{'<'}</li>
            {pages.map((page, i) => (
                <li key={i} className={classNames('pagination__arrow pagination__item', {
                    'pagination__item_active': page == currentPage.toString()
                })} onClick={() => onClickPage(page)}>{page}</li>
            ))}
            <li className='pagination__arrow pagination__item' onClick={onNext}>{'>'}</li>
        </ul>
    )
});

export default Pagination