import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react'
import shop from '../../../store/shop';

interface PaginationProps {
    window?: number;
    maxPages: number;
    currentPage: number;
    back: () => void;
    next: () => void;
    setPage: (page: number) => void;
}

const Pagination: FC<PaginationProps> = observer(({ window = 9, maxPages, currentPage, back, next, setPage }) => {
    const [pages, setPages] = useState<Array<string>>([]);

    useEffect(() => {
        let pages: Array<string> = Array.from(Array(maxPages).keys()).map(i => (i + 1).toString());
        if (maxPages <= 9) {
            setPages(pages);
            return;
        }

        const currentPageIndex = pages.findIndex(p => p == currentPage.toString());
        let leftIndex = currentPageIndex - Math.floor(window / 2);
        let rightIndex = currentPageIndex + Math.floor(window / 2) + 1;

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

        if (pages[1] != '2') {
            pages[1] = '...';
        }

        if (pages[pages.length - 2] != (maxPages - 1).toString()) {
            pages[pages.length - 2] = '...';
        }


        setPages(pages);
    }, [currentPage]);

    const onClickPage = (page: string) => {
        if (page != '...') {
            setPage(+page);
        }
    }

    return (
        <ul className='pagination rcc'>
            <li className='pagination__arrow pagination__item' onClick={back}>{'<'}</li>
            {pages.map((page, i) => (
                <li key={i} className={classNames('pagination__arrow pagination__item', {
                    'pagination__item_active': page == currentPage.toString()
                })} onClick={() => onClickPage(page)}>{page}</li>
            ))}
            <li className='pagination__arrow pagination__item' onClick={next}>{'>'}</li>
        </ul>

    )
});

export default Pagination