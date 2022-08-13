import { observer, useLocalObservable } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import MultiRangeSlider from '../../../../../lib/MultiRangeSlider/MultiRangeSlider'
import catalog from '../../../../../store/catalog'
import { ICkeckValue } from '../../../../../types/types'
import FilterItem from '../FilterItem'

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

const ProductFilters = observer(() => {
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
        catalog.selectPriceRange(min, max);
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
        <div className='filters__content'>
            <div className='filters__title'>{catalog.category.name}</div>
            <div className='filters__line'></div>
            <div className='filters__attr-name'>Ціна</div>
            <div className='filters__price'>
                <MultiRangeSlider
                    min={0}
                    max={Math.ceil(catalog.priceRange.max)}
                    onChange={({ min, max }) => { }}
                    onAccept={onAcceptRange} />
            </div>
            {localStore.brand.allValues.length !== 0 && <FilterItem attribute={localStore.brand} onCheck={onCheckBrands} />}
            {localStore.attributes.map(attr => (
                <FilterItem key={attr.id} attribute={attr} onCheck={onCheck} />
            ))}
        </div>
    )
});

export default ProductFilters