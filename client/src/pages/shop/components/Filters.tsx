import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import MultiRangeSlider from '../../../lib/MultiRangeSlider/MultiRangeSlider';
import catalog from '../../../store/catalog';
import shop from '../../../store/catalog';
import { IFilters } from '../../../types/IFilters';
import { IAttribute, ICkeckValue } from '../../../types/types'

interface ICheckAttribute {
    id: number;
    name: string;
    allValues: ICheckValue[];
}

interface ICheckValue {
    value: string;
    checked: boolean;
}

interface LocalStore {
    attributes: ICheckAttribute[];
}

interface FiltersProps {
    isOpen: boolean;
    onClose: () => void;
}

const Filters: FC<FiltersProps> = observer(({ isOpen, onClose }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        attributes: []
    }))

    useEffect(() => {
        localStore.attributes = [];
        for (const attr of catalog.filters.attributes) {
            localStore.attributes.push({
                ...attr.attribute,
                allValues: attr.attribute.allValues.map(v => { return { value: v, checked: false } })
            })
        }
    }, [catalog.filters.attributes]);

    const onCheckedChange = (attribute: string, checkValue: ICkeckValue) => {
        checkValue.checked = !checkValue.checked;
        if (checkValue.checked) {
            catalog.setFilter(attribute, checkValue.value)
        } else {
            catalog.deleteFilter(attribute, checkValue.value)
        }
    }

    const onAcceptRange = (min: number, max: number) => {
        shop.selectPriceRange(min, max);
    }

    return (
        <div className={classNames('filters__mask ', {
            'filters__mask_opened': isOpen
        })}>
            <div className='filters'>
                <div className='filters__close-btn' onClick={onClose}></div>
                <div className='filters__title'>Косметика</div>
                <div className='filters__line'></div>
                <div>
                    <div className='filters__attr-name'>Price</div>
                    <div className='filters__price'>
                        <MultiRangeSlider
                            min={0}
                            max={Math.ceil(catalog.priceRange.max)}
                            onChange={({ min, max }) => { }}
                            onAccept={onAcceptRange} />
                    </div>
                    {localStore.attributes.map(attr => (
                        <div key={attr.id} className='filters__attr'>
                            <div className='filters__attr-name'>{attr.name}</div>
                            <ul className='filters__attr-list'>
                                {attr.allValues.map(attrValue => (
                                    <li key={`${attr.id}-${attrValue.value}`} className='filters__attr-item rlc'>
                                        <label className='filters__attr-value rcc'>{attrValue.value}
                                            <input className='filters__checkbox' type="checkbox" checked={attrValue.checked} onChange={() => onCheckedChange(attr.name, attrValue)} />
                                            <span className='filters__checkmark'></span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
});

export default Filters