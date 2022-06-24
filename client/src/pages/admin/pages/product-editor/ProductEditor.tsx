import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { ChangeEvent, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import CategoryList from '../../../../components/CategoryList';
import FileUploader from '../../../../lib/FileUploader/FileUploader';
import catalog from '../../../../store/catalog';
import shop from '../../../../store/shop';
import '../../../../styles/admin/admin-general.scss';
import '../../../../styles/admin/product-editor.scss';
import { ICategory } from '../../../../types/ICategory';
import { IProduct } from '../../../../types/IProduct';
import Product from '../../../shop/components/product-card/Product';
import { ViewMode } from '../../../shop/components/ProductCatalog';
import ProductGrid from '../../../shop/components/ProductGrid';

interface LocalStore {
    selectedCategory?: ICategory;
    product: IProduct;
}

const ProductEditor = observer(() => {
    const inputRef = useRef<HTMLInputElement>(null);

    const getProductTemplate = () => {
        return {
            id: -1,
            categoryId: -1,
            userId: -1,
            title: '',
            description: '',
            price: 0,
            oldPrice: 0,
            isNew: false,
            count: 0,
            discountPercent: 0,
            attributes: new Map<string, string>(),
            images: [{ id: -1, url: 'https://htmldemo.net/melani/melani/assets/img/product/product-9.jpg', isMain: false }]
        }
    }

    const localStore = useLocalObservable<LocalStore>(() => ({
        product: getProductTemplate()
    }))
    localStore.product.discountPercent = -Math.floor((1 - localStore.product.price / localStore.product.oldPrice) * 100);

    useEffect(() => {
        localStore.selectedCategory = shop.categories[0];
        if (localStore.selectedCategory) {
            for (const attr of localStore.selectedCategory.keyAttributes) {
                localStore.product.attributes.set(attr.name, '');
            }
        }
    }, [shop.categories]);

    const onUploadImages = (e: ChangeEvent<HTMLInputElement>) => {

    }

    const onAccept = () => {
        if (!validate()) {
            return;
        }

        catalog.addProduct(localStore.product);
    }

    const onSelectCategory = (category: ICategory) => {
        catalog.init(category.routeName);
        localStore.selectedCategory = category;
        onClear();
    }

    const onClear = () => {
        localStore.product = getProductTemplate();
    }

    const validate = (): boolean => {
        const { title, description, price, oldPrice, attributes } = localStore.product;
        if (!title || !description || !price || !oldPrice) {
            return false;
        }

        for (const value in attributes.values()) {
            if (!value) {
                return false;
            }
        }

        return true;
    }

    return (
        <div className='product-editor'>
            <div className='admin-general__subtitle'>Каталоги</div>
            <CategoryList categories={shop.categories} onClick={onSelectCategory} />
            <div className='admin-general__line'></div>
            <div className='admin-general__subtitle'>{`Товари у каталозі "${localStore.selectedCategory?.name}"`}</div>
            <ProductGrid products={catalog.products} viewMode={ViewMode.GRID} />
            <div className='admin-general__line'></div>
            <div className='product-editor__form'>
                <div className='product-editor__images clc'>
                    <FileUploader inputRef={inputRef} className='product-editor__images-cont' onUploadImage={onUploadImages}>
                        <div className='product-editor__images'>
                            <div className='product-editor__main-image'>

                            </div>
                            <div className='product-editor__image-grid'>

                            </div>
                        </div>
                    </FileUploader>

                </div>
                <div className='product-editor__chars'>
                    <div className='product-editor__chars-head rlc'>
                        <div className='admin-general__subtitle'>Головне</div>
                        <div className='admin-general__clear-btn' onClick={onClear}>Clear</div>
                    </div>
                    <div className='rlc'>
                        <div className='admin-general__input-title'>Назва: </div>
                        <input className='admin-general__input' placeholder='Введіть назву' value={localStore.product.title} onChange={(v) => localStore.product.title = v.target.value} />
                    </div>
                    <div className='rlc'>
                        <div className='admin-general__input-title'>Опис: </div>
                        <textarea className='admin-general__input admin-general__input_textarea' placeholder='Введіть опис' value={localStore.product.description} onChange={(v) => localStore.product.description = v.target.value} />
                    </div>

                    <div className='rlc'>
                        <div className='admin-general__input-title'>Ціна: </div>
                        <input type="number" step={0.01} onWheel={(e) => e.currentTarget.blur()} min={0} className='admin-general__input' value={localStore.product.price ?? ''} onChange={(v) => localStore.product.price = +v.target.value} />
                    </div>
                    <div className='rlc'>
                        <div className='admin-general__input-title'>Минула ціна: </div>
                        <input type="number" step={0.01} onWheel={(e) => e.currentTarget.blur()} min={0} className='admin-general__input' value={localStore.product.oldPrice} onChange={(v) => localStore.product.oldPrice = +v.target.value} />
                    </div>
                    <div className='rlc'>
                        <div className='admin-general__input-title'>Кількість: </div>
                        <input type="number" onWheel={(e) => e.currentTarget.blur()} min={0} className='admin-general__input' value={localStore.product.count} onChange={(v) => localStore.product.count = +v.target.value} />
                    </div>
                    <div className='admin-general__subtitle'>Характеристики</div>
                    <ul className='product-editor__attributes clc'>
                        {[...localStore.product.attributes].map(([key, value]) => (
                            <li key={key} className='product-editor__chars-editor rlc'>
                                <div className='admin-general__input-title'>{key}:</div>
                                <input type="text" className='admin-general__input product-editor__attribute-value' placeholder='Значення' value={value} onChange={(v) => localStore.product.attributes.set(key, v.target.value)} />
                            </li>
                        ))}

                    </ul>
                </div>
                <div className={classNames('admin-general__action-btn admin-general__action-btn_accept ccc', {
                    "admin-general__action-btn_inactive": !validate()
                })} onClick={onAccept}>Accept</div>
            </div>
            <div className='admin-general__line'></div>
            <div className='admin-general__subtitle'>Передогляд</div>
            <div className='product-editor__prev rcc'>
                <div className='product-editor__prev-product product-editor__prev-product_quick-view'>
                    <Product product={localStore.product} type='full-view' />
                </div>
                <div className='product-editor__prev-product product-editor__prev-product_small'>
                    <Product product={localStore.product} type='small' />
                </div>
            </div>
        </div>
    )
});

export default ProductEditor