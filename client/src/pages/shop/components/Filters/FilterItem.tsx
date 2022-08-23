import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC, useEffect, useRef } from 'react'
import { ICheckAttribute, ICheckValue } from './ProductFilters/ProductFilters';

interface FilterItemProps {
    attribute: ICheckAttribute;
    onCheck: (attributeId: number, checkValue: ICheckValue) => void;
}

interface LocalStore {
    currentHeight: number | string;
    maxHeight: number;
}

const FilterItem: FC<FilterItemProps> = observer(({ attribute, onCheck }) => {
    const ref = useRef<HTMLUListElement>(null);
    const localStore = useLocalObservable<LocalStore>(() => ({
        currentHeight: 'max-content',
        maxHeight: -1
    }))

    useEffect(() => {
        localStore.maxHeight = ref.current?.clientHeight ?? 0
        localStore.currentHeight = 0;
    }, [])

    const toggleList = () => {
        localStore.currentHeight = localStore.currentHeight === 0 ? localStore.maxHeight : 0
    }

    return (
        <div key={attribute.id} className='filters__attr' >
            <div className='filters__attr-name filters__attr-name_touchable' onClick={toggleList}>{attribute.name}</div>
            <ul ref={ref} className='filters__attr-list' style={{
                height: localStore.currentHeight
            }}>
                {attribute.allValues.map(attrValue => (
                    <li key={`${attribute.id}-${attrValue.name}`} className={classNames('filters__attr-item rlc', {
                        'filters__attr-item_disable': attrValue.productCount === 0
                    })}>
                        <label className='filters__attr-value rcc'>{attrValue.name} ({attrValue.productCount})
                            <input className='filters__checkbox'
                                type="checkbox"
                                checked={attrValue.checked}
                                onChange={() => attrValue.productCount !== 0 ? onCheck(attribute.id, attrValue) : {}}
                            />
                            <span className='filters__checkmark'></span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    )
});

export default FilterItem