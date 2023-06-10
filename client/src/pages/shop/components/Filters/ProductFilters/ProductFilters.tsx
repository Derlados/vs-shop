import cyrillicToTranslit from 'cyrillic-to-translit-js'
import { observer, useLocalObservable } from 'mobx-react-lite'
import React, { FC, useEffect } from 'react'
import MultiRangeSlider from '../../../../../lib/components/MultiRangeSlider/MultiRangeSlider'
import { FilterOptions } from '../../../../../services/products/products.service'
import products from '../../../../../store/product'
import { IFilters } from '../../../../../types/IFilters'
import FilterItem from '../FilterItem'

export interface ICheckAttribute {
    id: number;
    name: string;
    allValues: ICheckValue[];
}

export interface ICheckValue {
    id: number;
    name: string;
    isAvailable: boolean;
    productCount: number;
    checked: boolean;
}

interface ProductFiltersProps {
    selectedFilters: FilterOptions;
    onCheckFilter: (attributeId: number, value: number, checked: boolean) => void;
    onCheckBrand: (brand: string, checked: boolean) => void;
    onSelectRange: (min: number, max: number) => void;
}

interface LocalStore {
    brand: ICheckAttribute;
    attributes: ICheckAttribute[];
}

const ProductFilters: FC<ProductFiltersProps> = observer(({ selectedFilters, onCheckFilter, onCheckBrand, onSelectRange }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        brand: {
            id: 0,
            name: "Бренд",
            allValues: []
        },
        attributes: [],
    }))

    useEffect(() => {
        console.log("here");
        localStore.attributes = [];
        for (const attr of products.filters.attributes) {
            localStore.attributes.push({
                ...attr.attribute,
                allValues: (Array.from(attr.attribute.allValues))
                    .map(v => {
                        return {
                            id: v.id,
                            name: v.name,
                            isAvailable: v.countProducts != 0,
                            productCount: v.countProducts!,
                            checked: isSelectedValue(attr.attribute.id, v.id)
                        }
                    }).sort(sortFilters)
            })
        }

        localStore.brand.allValues = products.brands.map((b) => {
            return {
                id: -1,
                name: b,
                isAvailable: products.getCountProductExistByBrand(b) != 0,
                productCount: products.getCountProductExistByBrand(b),
                checked: isSelectedBrand(b)
            }
        })
    }, [products.filters]);


    const sortFilters = (a: ICheckValue, b: ICheckValue) => {
        if (!isNaN(parseFloat(a.name))) {
            return sortNumbers(a, b);
        } else {
            return sortStrings(a, b);
        }
    }

    const sortStrings = (a: ICheckValue, b: ICheckValue) => {
        if (a.name < b.name) {
            return -1;
        }

        if (a.name > b.name) {
            return 1;
        }

        return 0;
    }

    const sortNumbers = (a: ICheckValue, b: ICheckValue) => {
        return parseFloat(a.name) - parseFloat(b.name);
    }

    const onCheckBrands = (ignore: number, checkValue: ICheckValue) => {
        checkValue.checked = !checkValue.checked;
        onCheckBrand(checkValue.name, checkValue.checked)
    }

    const onCheck = (attributeId: number, checkValue: ICheckValue) => {
        checkValue.checked = !checkValue.checked;
        onCheckFilter(attributeId, checkValue.id, checkValue.checked);
    }

    const isSelectedValue = (attributeId: number, valueId: number) => {
        const selectedValues = selectedFilters.filter?.get(attributeId) ?? [];
        return selectedValues.includes(valueId);
    }

    const isSelectedBrand = (brand: string) => {
        const selectedBrands = selectedFilters.brands ?? [];
        return selectedBrands.includes(brand)
    }

    return (
        <div className='filters__content'>
            <div className='filters__title'>{products.category.name}</div>
            <div className='filters__line'></div>
            <div className='filters__attr-name'>Ціна</div>
            <div className='filters__price'>
                <MultiRangeSlider
                    min={0}
                    max={products.filters.priceRange.max}
                    selectedMin={selectedFilters.minPrice ?? 0}
                    selectedMax={selectedFilters.maxPrice ?? products.filters.priceRange.max}
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