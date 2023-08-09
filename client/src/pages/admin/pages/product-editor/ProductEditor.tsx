import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { customAlphabet, nanoid } from 'nanoid';
import { ChangeEvent, useEffect, useRef } from 'react';
import CategoryList from '../../../../components/Category/CategoryList/CategoryList';
import Checkbox from '../../../../lib/components/Checkbox/Checkbox';
import FileUploader from '../../../../lib/components/FileUploader/FileUploader';
import products from '../../../../store/product';
import shop from '../../../../store/shop';
import '../../../../styles/admin/admin-general.scss';
import './product-editor.scss';
import { ICategory } from '../../../../types/ICategory';
import { IImage } from '../../../../types/IImage';
import { AvailableStatus, IProduct } from '../../../../types/IProduct';
import { REGEX } from '../../../../values/regex';
import ProductCard from '../../../../components/ProductCard/ProductCard';
import { ViewMode } from '../../../shop/components/ProductCatalog/ProductCatalog';
import ProductGrid from '../../../shop/components/ProductGrid';
import { IProductAttribute } from '../../../../types/IProductAttribyte';
import catalog from '../../../../store/catalog';
import Selector from '../../../../lib/components/Selector/Selector';
import { IAttribute } from '../../../../types/IAttribute';
import productEditorStore from '../../../../store/product-editor/product-editor.store';
import ProductEditorInput from './component/ProductEditorInput';

const MAX_PRODUCTS_BY_PAGE = 8;

interface LocalStore {
    selectedCategory?: ICategory;
    deletedImagesId: number[];
    uploadedFiles: IUploadedFile[];
    product: IProduct;
}

interface IUploadedFile {
    id: number;
    file: File;
}

const ProductEditor = observer(() => {
    const fileUploaderRef = useRef<HTMLInputElement>(null);


    const getMainImg = (): IImage => {
        return productEditorStore.mainImage;
    }

    useEffect(() => {
        if (catalog.categories[0]) {
            onSelectCategory(catalog.categories[0])
        }
    }, [catalog.categories]);

    const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => {
        productEditorStore.onTitleChanged(e.target.value);
    }

    const onBrandChanged = (brand: string) => {
        productEditorStore.onBrandChanged(brand);
    }

    const onDescriptionChanged = (e: ChangeEvent<HTMLTextAreaElement>) => {
        productEditorStore.onDescriptionChanged(e.target.value);
    }

    const onPriceChanged = (e: ChangeEvent<HTMLInputElement>) => {
        productEditorStore.onPriceChanged(Number(e.target.value));
    }

    const onOldPriceChanged = (e: ChangeEvent<HTMLInputElement>) => {
        productEditorStore.onOldPriceChanged(Number(e.target.value));
    }

    const onAmountChanged = (e: ChangeEvent<HTMLInputElement>) => {
        productEditorStore.onAmountChanged(Number(e.target.value));
    }

    const onMaxByOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
        productEditorStore.onMaxByOrderChange(Number(e.target.value));
    }

    const onUploadImages = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const images = e.target.files;
            productEditorStore.uploadImages(images);

            // Clearing the input from the file (so that when the file is cleared, the same file can be displayed when loading)
            if (fileUploaderRef.current) {
                fileUploaderRef.current.value = '';
            }
        }
    }

    const selectMainImg = (image: IImage) => {
        productEditorStore.selectMainImage(image.id);
    }

    const deleteImg = (image: IImage) => {
        productEditorStore.deleteImage(image);
    }

    const toggleIsNew = () => {
        productEditorStore.onIsNewToggled();
    }

    const onAccept = () => {
        productEditorStore.saveProduct();
    }

    const onEdit = (product: IProduct) => {
        productEditorStore.selectProduct(product.id);
    }

    const onSelectCategory = (category: ICategory) => {
        productEditorStore.onCategorySelected(category);
    }

    const onClear = () => {
        productEditorStore.clear();
    }

    const onDelete = () => {
        productEditorStore.onProductDeleted();
    }

    const getBrandValues = (brands: string[]) => {
        return new Map<string, string>(brands.map(b => [b, b]));
    }

    const getAttributeValues = (attribute: IProductAttribute) => {
        if (!products.filters) {
            return new Map<string, string>();
        }

        const attrValues = new Map<string, string>();
        const foundAttribute = products.filters.attributes.find(a => a.attribute.id == attribute.id)?.attribute;
        const foundValue = foundAttribute?.allValues.find(v => v.name == attribute.value.name);

        if (attribute) {
            foundAttribute?.allValues.forEach(v => attrValues.set(
                v.id.toString(),
                v.name
            ));
        }

        attrValues.delete(foundValue?.id.toString() ?? '');
        foundAttribute?.allValues.forEach(v => attrValues.set(
            attribute.value?.id.toString() ?? '',
            attribute.value?.name ?? ''
        ));
        return attrValues;
    }

    return (
        <div className='product-editor'>
            <div className='admin-general__title'>Редактор товаров</div>
            <div className='admin-general__subtitle'>Каталоги</div>
            <CategoryList categories={catalog.categories} onClick={onSelectCategory} />
            <div className='admin-general__line'></div>
            <div className='product-editor__product-list'>
                <div className='admin-general__subtitle'>Товары в каталоге "{productEditorStore.category.name}"</div>
                <div className='product-editor__grid'>
                    <ProductGrid products={products.products} viewMode={ViewMode.GRID} maxPages={products.filters?.maxPages ?? 100} onSelectProduct={onEdit} onChangePage={() => { }} />
                </div>
                {/* <div className='product-editor__list'>
                    {products.products.map(p => (
                        <div key={p.id} className='home-editor__product rlc' onClick={() => onEdit(p)}>
                            <img className='home-editor__product-img' src={p.images.find(img => img.isMain)?.url ?? p.images[0].url} />
                            <span className='home-editor__product-name'>{p.title}</span>
                        </div>
                    ))}
                </div> */}
            </div>
            <div className='admin-general__line'></div>
            <div className='product-editor__form'>
                <div className='product-editor__form-head rlc'>
                    <div className='admin-general__subtitle'>Главное</div>
                    <div className='admin-general__clear-btn' onClick={onClear}>Очистить</div>
                </div>
                <div className='product-editor__images-editor clc'>
                    <FileUploader inputRef={fileUploaderRef} className='product-editor__uploader ccc' multiple={true} onUploadImage={onUploadImages}>
                        <div className='rcc'>
                            <div className='product-editor__uploader-icon'></div>
                            <div className='product-editor__uploader-text'>Drop files to upload or <b>Browse Files</b></div>
                        </div>
                    </FileUploader>
                    {productEditorStore.editedProduct.images.length !== 0 &&
                        <div className='product-editor__images rcc'>
                            <img className='product-editor__main-image' src={getMainImg().url} />
                            <div className='product-editor__image-grid rlt'>
                                {productEditorStore.editedProduct.images.map(img => (
                                    <div key={img.id} className={classNames('product-editor__image-grid-item', {
                                        'product-editor__image-grid-item_active': img.isMain
                                    })}>
                                        <img className='product-editor__image-item' src={img.url} onClick={() => selectMainImg(img)} />
                                        <div onClick={() => deleteImg(img)} className='product-editor__del-img ccc'>X</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </div>
                <div className='product-editor__chars'>
                    <ProductEditorInput
                        title='Название: '
                        value={productEditorStore.editedProduct.title}
                        onChange={onTitleChanged}
                    />
                    <div className='product-editor__input-wrap rlc'>
                        <div className='admin-general__input-title'>Бренд: </div>
                        <Selector
                            className='admin-general__selector'
                            hint='Введите новый или выберите существуюищй бренд'
                            innerHint={true}
                            withInput={true}
                            withSearch={true}
                            values={getBrandValues(productEditorStore.category.allBrands ?? [])}
                            onSelect={(key, value) => productEditorStore.editedProduct.brand = key}
                            onChange={onBrandChanged}
                        />
                    </div>
                    <div className='product-editor__input-wrap rlc'>
                        <div className='admin-general__input-title'>Описание: </div>
                        <textarea className='admin-general__input admin-general__input_textarea' placeholder='Введіть опис'
                            value={productEditorStore.editedProduct.description} onChange={onDescriptionChanged} />
                    </div>
                    <ProductEditorInput
                        title='Цена: '
                        type="number"
                        step={0.01}
                        value={productEditorStore.editedProduct.price}
                        onChange={onPriceChanged}
                    />
                    <ProductEditorInput
                        title='Прошлая цена: '
                        type="number"
                        step={0.01}
                        value={productEditorStore.editedProduct.oldPrice}
                        onChange={onOldPriceChanged}
                    />
                    <div className='product-editor__input-wrap rlc'>
                        <div className='admin-general__input-title'>Количество: </div>
                        {productEditorStore.editedProduct.count !== undefined ?
                            <input
                                className='admin-general__input'
                                type="number"
                                onWheel={(e) => e.currentTarget.blur()}
                                min={0}
                                value={productEditorStore.editedProduct.count}
                                onChange={onAmountChanged}
                            />
                            :
                            <div className='admin-general__input'>Загрузка ...</div>
                        }
                    </div>
                    <ProductEditorInput
                        title='Количество на заказ:  '
                        type="number"
                        value={productEditorStore.editedProduct.maxByOrder}
                        onChange={onMaxByOrderChange}
                    />
                    <div className='product-editor__input-wrap rlc'>
                        <div className='admin-general__input-title'>Новый ?: </div>
                        <Checkbox checked={productEditorStore.editedProduct.isNew} onChange={toggleIsNew} />
                    </div>
                    <div className='admin-general__subtitle'>Характеристики</div>
                    <ul className='product-editor__attributes clc'>
                        {productEditorStore.editedProduct.attributes.map(attr => (
                            <li key={attr.name} className='product-editor__chars-editor product-editor__input-wrap rlc'>
                                <div className='admin-general__input-title'>{attr.name}:</div>
                                <Selector
                                    className='admin-general__selector'
                                    hint='Введите новое или выберите существующее значение'
                                    innerHint={true}
                                    withInput={true}
                                    withSearch={true}
                                    selectedId={attr.value.id.toString()}
                                    values={getAttributeValues(attr)}
                                    onSelect={(key, value) => attr.value.name = value}
                                    onChange={(value) => attr.value.name = value}
                                />
                            </li>
                        ))}

                    </ul>
                </div>
                <div className={classNames('admin-general__action-btn admin-general__action-btn_accept ccc', {
                    "admin-general__action-btn_inactive": !productEditorStore.isValid
                })} onClick={onAccept}>Сохранить</div>
                {productEditorStore.editedProduct.id !== -1 &&
                    <div className={'admin-general__action-btn admin-general__action-btn_delete ccc'} onClick={onDelete}>Удалить</div>}
            </div>
            <div className='admin-general__line'></div>
            <div className='admin-general__subtitle'>Предпросмотр</div>
            <div className='product-editor__prev rct'>
                <div className='product-editor__prev-product product-editor__prev-product_quick-view'>
                    <ProductCard product={productEditorStore.editedProduct} type='full-view' />
                </div>
                <div className='product-editor__prev-product product-editor__prev-product_small'>
                    <ProductCard product={productEditorStore.editedProduct} type='small' />
                </div>
            </div>
        </div>
    )
});

export default ProductEditor