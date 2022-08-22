import { observer, useLocalObservable } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import MultiRangeSlider from '../../../../../lib/components/MultiRangeSlider/MultiRangeSlider'
import catalog from '../../../../../store/catalog'
import FilterItem from '../FilterItem'

export interface ICheckAttribute {
    id: number;
    name: string;
    allValues: ICheckValue[];
}

export interface ICheckValue {
    id: number;
    name: string;
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
                allValues: (Array.from(attr.attribute.allValues))
                    .map(v => { return { id: v.id, name: v.name, checked: false } })
            })
        }

        localStore.brand.allValues = catalog.brands.map((b) => { return { id: -1, name: b, checked: false } })
    }, [catalog.filters.attributes, catalog.brands]);

    const onAcceptRange = (min: number, max: number) => {
        catalog.selectPriceRange(min, max);
    }

    const onCheckBrands = (ignore: number, checkValue: ICheckValue) => {
        checkValue.checked = !checkValue.checked;
        if (checkValue.checked) {
            catalog.selectBrand(checkValue.name);
        } else {
            catalog.deselectBrand(checkValue.name);
        }
    }

    const onCheck = (attributeId: number, checkValue: ICheckValue) => {
        checkValue.checked = !checkValue.checked;
        if (checkValue.checked) {
            catalog.setFilter(attributeId, checkValue.name)
        } else {
            // catalog.deselectFilter(attributeId, checkValue.name)
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