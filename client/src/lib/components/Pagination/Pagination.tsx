import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useState } from 'react';
import { Resolutions } from '../../../values/resolutions';
import './pagination.scss';

interface PaginationProps {
    maxPageWindow?: number;
    maxPages: number;
    currentPage: number;
    back: () => void;
    next: () => void;
    setPage: (page: number) => void;
}

const MAX_MOBILE_VERTICAL = 5;

const Pagination: FC<PaginationProps> = observer(({ maxPageWindow = 9, maxPages, currentPage, back, next, setPage }) => {
    const [pageWindow, setPageWindow] = useState(maxPageWindow);
    const [pages, setPages] = useState<Array<string>>([]);

    useEffect(() => {
        window.addEventListener("resize", () => {
            if (window.innerWidth <= Resolutions.MOBILE_VERtICAL) {
                setPageWindow(MAX_MOBILE_VERTICAL);
            } else {
                setPageWindow(maxPageWindow);
            }
        })
    }, [])

    useEffect(() => {
        let pages: Array<string> = Array.from(Array(maxPages).keys()).map(i => (i + 1).toString());
        if (maxPages <= pageWindow) {
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
            <li className='pagination__arrow pagination__item ccc' onClick={onBack}>{'<'}</li>
            {pages.map((page, i) => (
                <li key={i} className={classNames('pagination__arrow pagination__item ccc', {
                    'pagination__item_active': page == currentPage.toString()
                })} onClick={() => onClickPage(page)}>{page}</li>
            ))}
            <li className='pagination__arrow pagination__item ccc' onClick={onNext}>{'>'}</li>
        </ul>
    )
});

export default Pagination