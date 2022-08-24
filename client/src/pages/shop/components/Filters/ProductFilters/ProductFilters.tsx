import cyrillicToTranslit from 'cyrillic-to-translit-js'
import { observer, useLocalObservable } from 'mobx-react-lite'
import React, { FC, useEffect } from 'react'
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
    productCount: number;
    checked: boolean;
}

interface ProductFiltersProps {
    onCheckFilter: (attributeId: number, value: number, checked: boolean) => void;
    onCheckBrand: (brand: string, checked: boolean) => void;
    onSelectRange: (min: number, max: number) => void;
}

interface LocalStore {
    brand: ICheckAttribute;
    attributes: ICheckAttribute[];

}

const ProductFilters: FC<ProductFiltersProps> = observer(({ onCheckFilter, onCheckBrand, onSelectRange }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        brand: {
            id: 0,
            name: "Бренд",
            allValues: []
        },
        attributes: [],
    }))

    useEffect(() => {
        localStore.attributes = [];
        for (const attr of catalog.filters.attributes) {
            localStore.attributes.push({
                ...attr.attribute,
                allValues: (Array.from(attr.attribute.allValues))
                    .map(v => {
                        return {
                            id: v.id,
                            name: v.name,
                            productCount: catalog.countProductByValue(attr.attribute.id, v.name),
                            checked: catalog.hasSelectedFilter(attr.attribute.id, v.id)
                        }
                    })
            })
        }

        localStore.brand.allValues = catalog.brands.map((b) => { return { id: -1, name: b, productCount: catalog.conntProductByBrand(b), checked: catalog.hasSelectedBrand(cyrillicToTranslit().transform(b, "_")) } })
    }, [catalog.filters.attributes, catalog.brands, catalog.selectedFilters, catalog.selectedTranslitBrands]);

    const onCheckBrands = (ignore: number, checkValue: ICheckValue) => {
        checkValue.checked = !checkValue.checked;
        onCheckBrand(checkValue.name, checkValue.checked)
    }

    const onCheck = (attributeId: number, checkValue: ICheckValue) => {
        checkValue.checked = !checkValue.checked;
        onCheckFilter(attributeId, checkValue.id, checkValue.checked);
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
                    selectedMin={catalog.selectedPriceRange.min}
                    selectedMax={catalog.selectedPriceRange.max}
                    onChange={({ min, max }) => { }}
                    onAccept={onSelectRange} />
            </div>
            {localStore.brand.allValues.length !== 0 && <FilterItem attribute={localStore.brand} onCheck={onCheckBrands} />}
            {localStore.attributes.map(attr => (
                <FilterItem key={attr.id} attribute={attr} onCheck={onCheck} />
            ))}
        </div>
    )
});

export default ProductFilters