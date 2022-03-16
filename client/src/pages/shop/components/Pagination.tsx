import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react'
import { createModuleResolutionCache } from 'typescript';

interface PaginationProps {
    maxPages: number;
    currentPage: number;
}

const Pagination: FC<PaginationProps> = ({ maxPages, currentPage }) => {
    const [pages, setPages] = useState<Array<string>>([]);

    useEffect(() => {
        const pages: Array<string> = [
            '1',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            maxPages.toString()
        ];
        let left: number = 1;
        let right: number = pages.length - 2;

        if (maxPages <= 9) {
            setPages(Array.from(Array(10).keys()).map(i => i.toString()))
            return;
        }

        if (currentPage - 1 >= 5) {
            pages[1] = '...';
            pages[2] = (currentPage - 2).toString();
            left = 3;
        }

        if (maxPages - currentPage >= 5) {
            pages[pages.length - 2] = '...';
            right = pages.length - 3;
        }

        let page = +pages[left - 1];
        for (let i = left; i <= right; ++i) {
            pages[i] = (++page).toString();
        }

        setPages(pages);
    }, [currentPage]);


    return (
        <ul className='pagination rcc'>
            <li className='pagination__arrow pagination__item'>{'<'}</li>
            {pages.map((page, i) => (
                <li key={i} className={classNames('pagination__arrow pagination__item', {
                    'pagination__item_active': page == currentPage.toString()
                })}>{page}</li>
            ))}
            <li className='pagination__arrow pagination__item'>{'>'}</li>
        </ul>

    )
}

export default Pagination