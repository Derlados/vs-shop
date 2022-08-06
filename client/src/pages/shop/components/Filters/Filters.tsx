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
    brand: ICheckAttribute;
    attributes: ICheckAttribute[];
}

interface FiltersProps {
    isOpen: boolean;
    onClose: () => void;
}

const Filters: FC<FiltersProps> = observer(({ isOpen, onClose }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        brand: {
            id: 0,
            name: "Бренд",
            allValues: []
        },
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

        localStore.brand.allValues = catalog.brands.map((b) => { return { value: b, checked: false } })
    }, [catalog.filters.attributes, catalog.brands]);

    const onAcceptRange = (min: number, max: number) => {
        shop.selectPriceRange(min, max);
    }

    const onCheckBrands = (ignore: string, checkValue: ICkeckValue) => {
        checkValue.checked = !checkValue.checked;
        if (checkValue.checked) {
            catalog.selectBrand(checkValue.value);
        } else {
            catalog.deselectBrand(checkValue.value);
        }
    }

    const onCheck = (attribute: string, checkValue: ICkeckValue) => {
        checkValue.checked = !checkValue.checked;
        if (checkValue.checked) {
            catalog.setFilter(attribute, checkValue.value)
        } else {
            catalog.deselectFilter(attribute, checkValue.value)
        }
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
                    <FilterItem attribute={localStore.brand} onCheck={onCheckBrands} />
                    {localStore.attributes.map(attr => (
                        <FilterItem key={attr.id} attribute={attr} onCheck={onCheck} />
                    ))}
                </div>
            </div>
        </div>
    )
});

export default Filters