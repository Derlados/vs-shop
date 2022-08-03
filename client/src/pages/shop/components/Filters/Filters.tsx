import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import MultiRangeSlider from '../../../../lib/MultiRangeSlider/MultiRangeSlider';
import catalog from '../../../../store/catalog';
import shop from '../../../../store/catalog';
import { ICkeckValue } from '../../../../types/types';
import FilterItem from './FilterItem';
import './filters.scss';

export interface ICheckAttribute {
    id: number;
    name: string;
    allValues: ICheckValue[];
}

export interface ICheckValue {
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

    const onCheck = (attribute: string, checkValue: ICkeckValue) => {
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
                <div className='filters__title'>{catalog.category.name}</div>
                <div className='filters__line'></div>
                <div>
                    <div className='filters__attr-name'>Ціна</div>
                    <div className='filters__price'>
                        <MultiRangeSlider
                            min={0}
                            max={Math.ceil(catalog.priceRange.max)}
                            onChange={({ min, max }) => { }}
                            onAccept={onAcceptRange} />
                    </div>
                    {localStore.attributes.map(attr => (
                        <FilterItem key={attr.id} attribute={attr} onCheck={onCheck} />
                    ))}
                </div>
            </div>
        </div>
    )
});

export default Filters