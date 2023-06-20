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
    const inputRef = useRef<HTMLInputElement>(null);
    const localStore = useLocalObservable<LocalStore>(() => ({
        deletedImagesId: [],
        uploadedFiles: [],
        product: {
            id: -1,
            categoryId: -1,
            userId: -1,
            title: '',
            brand: '',
            description: '',
            url: '',
            price: 0,
            oldPrice: 0,
            isNew: false,
            isBestseller: false,
            availability: AvailableStatus.IN_STOCK,
            maxByOrder: 0,
            count: 0,
            discountPercent: 0,
            attributes: [],
            images: []
        }
    }))
    localStore.product.discountPercent = Math.floor((1 - localStore.product.price / localStore.product.oldPrice) * 100);

    const getProductTemplate = (): IProduct => {
        const attributes: IProductAttribute[] = [];
        if (localStore && localStore.selectedCategory) {
            for (const attr of localStore.selectedCategory.keyAttributes) {
                attributes.push({ id: attr.id, name: attr.name, value: { id: -1, name: '' } })
            }
        }

        return {
            id: -1,
            categoryId: -1,
            userId: -1,
            title: '',
            brand: '',
            description: '',
            url: '',
            price: 0,
            oldPrice: 0,
            isNew: false,
            isBestseller: false,
            availability: AvailableStatus.IN_STOCK,
            maxByOrder: 0,
            count: 0,
            discountPercent: 0,
            attributes: attributes,
            images: []
        }
    }

    const getMainImg = (): IImage => {
        let mainImg = localStore.product.images.find(img => img.isMain)
        if (!mainImg) {
            localStore.product.images[0].isMain = true;
            mainImg = localStore.product.images[0];
        }
        return mainImg;
    }

    useEffect(() => {
        if (catalog.categories[0]) {
            onSelectCategory(catalog.categories[0])
        }
    }, [catalog.categories]);

    const onUploadImages = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const nanoid = customAlphabet('1234567890', 18)
            const images = e.target.files;

            for (const image of images) {
                const id = Number(nanoid());
                localStore.product.images.push({
                    id: id,
                    url: URL.createObjectURL(image),
                    isMain: false
                })
                localStore.uploadedFiles.push({ id: id, file: image });
            }

            // Очистка input от файла (чтобы при очищении файла мог отобразится тот же файл при загрузке)
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    }

    const selectMainImg = (image: IImage) => {
        localStore.product.images.forEach((img) => img.isMain = false);
        image.isMain = true;

        const fileIndex = localStore.uploadedFiles.findIndex(uf => uf.id == image.id);
        if (fileIndex !== -1) {
            const temp = localStore.uploadedFiles[0];
            localStore.uploadedFiles[0] = localStore.uploadedFiles[fileIndex];
            localStore.uploadedFiles[fileIndex] = temp;
        }
    }

    const deleteImg = (image: IImage) => {
        let indexToDelete = localStore.product.images.findIndex(img => img == image);
        localStore.product.images.splice(indexToDelete, 1);

        indexToDelete = localStore.uploadedFiles.findIndex(file => file.id == image.id);
        if (indexToDelete != -1) {
            localStore.uploadedFiles.splice(indexToDelete, 1);
        }

        if (!REGEX.BLOB.test(image.url)) {
            localStore.deletedImagesId.push(image.id);
        }
    }

    const toggleIsNew = () => {
        localStore.product.isNew = !localStore.product.isNew;
    }

    const onAccept = () => {
        if (!validate()) {
            return;
        }

        // Проверка, если главным изображением стало одно из существующих - берет его id, иначе никакое id не передается
        const mainImage = getMainImg();
        let newMainImageId = undefined;
        if (!REGEX.BLOB.test(mainImage.url)) {
            newMainImageId = mainImage.id;
        }

        const files = localStore.uploadedFiles.map(uploadedFile => uploadedFile.file)

        if (localStore.product.id === -1) {
            products.addProduct(localStore.product, files, localStore.deletedImagesId, newMainImageId);
        } else {
            products.editProduct(localStore.product.id, localStore.product, files, localStore.deletedImagesId, newMainImageId);
        }

        onClear();
    }

    const onEdit = (product: IProduct) => {
        localStore.product = { ...product, images: JSON.parse(JSON.stringify(product.images)) }
        products.loadProductCount(localStore.product);
        localStore.uploadedFiles = [];
        localStore.deletedImagesId = [];
    }

    const onSelectCategory = (category: ICategory) => {
        products.fetchProducts(category.routeName);
        localStore.selectedCategory = category;
        onClear();
    }

    const onClear = () => {
        localStore.product = getProductTemplate();
        localStore.uploadedFiles = [];
        localStore.deletedImagesId = [];
    }

    const onDelete = () => {
        products.deleteProduct(localStore.product.id);
        onClear();
    }

    const validate = (): boolean => {
        if (localStore.uploadedFiles.length == 0 && localStore.product.images.length == 0) {
            return false;
        }

        const { title, brand, description, price, oldPrice, attributes } = localStore.product;
        if (!title || !brand || !description || !price || !oldPrice) {
            return false;
        }

        for (const value of attributes.values()) {
            if (!value) {
                return false;
            }
        }

        return true;
    }

    const getBrandValues = (brands: string[]) => {
        const brandValues = new Map<string, string>();
        brands.forEach(b => brandValues.set(b, b));

        return brandValues;
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
                <div className='admin-general__subtitle'>Товары в каталоге "{localStore.selectedCategory?.name}"</div>
                <div className='product-editor__grid'>
                    <ProductGrid products={products.products} viewMode={ViewMode.GRID} maxPages={products.filters.maxPages} onSelectProduct={onEdit} onChangePage={() => { }} />
                </div>
                <div className='product-editor__list'>
                    {products.products.map(p => (
                        <div></div>
                    ))}
                </div>
            </div>
            <div className='admin-general__line'></div>
            <div className='product-editor__form'>
                <div className='product-editor__form-head rlc'>
                    <div className='admin-general__subtitle'>Главное</div>
                    <div className='admin-general__clear-btn' onClick={onClear}>Очистить</div>
                </div>
                <div className='product-editor__images-editor clc'>
                    <FileUploader inputRef={inputRef} className='product-editor__uploader ccc' multiple={true} onUploadImage={onUploadImages}>
                        <div className='rcc'>
                            <div className='product-editor__uploader-icon'></div>
                            <div className='product-editor__uploader-text'>Drop files to upload or <b>Browse Files</b></div>
                        </div>
                    </FileUploader>
                    {localStore.product.images.length !== 0 &&
                        <div className='product-editor__images rcc'>
                            <img className='product-editor__main-image' src={getMainImg().url} />
                            <div className='product-editor__image-grid rlt'>
                                {localStore.product.images.map(img => (
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
                    <div className='product-editor__input-wrap rlc'>
                        <div className='admin-general__input-title'>Название: </div>
                        <input className='admin-general__input' placeholder='Введіть назву' value={localStore.product.title} onChange={(v) => localStore.product.title = v.target.value} />
                    </div>
                    <div className='product-editor__input-wrap rlc'>
                        <div className='admin-general__input-title'>Бренд: </div>
                        <Selector
                            className='admin-general__selector'
                            hint='Введите новый или выберите существуюищй бренд'
                            innerHint={true}
                            withInput={true}
                            withSearch={true}
                            values={getBrandValues(products.brands ?? [])}
                            onSelect={(key, value) => localStore.product.brand = key}
                            onChange={(value) => localStore.product.brand = value}
                        />
                    </div>
                    <div className='product-editor__input-wrap rlc'>
                        <div className='admin-general__input-title'>Описание: </div>
                        <textarea className='admin-general__input admin-general__input_textarea' placeholder='Введіть опис' value={localStore.product.description} onChange={(v) => localStore.product.description = v.target.value} />
                    </div>
                    <div className='product-editor__input-wrap rlc'>
                        <div className='admin-general__input-title'>Цена: </div>
                        <input type="number" step={0.01} onWheel={(e) => e.currentTarget.blur()} min={0} className='admin-general__input' value={localStore.product.price ?? ''} onChange={(v) => localStore.product.price = Number(v.target.value)} />
                    </div>
                    <div className='product-editor__input-wrap rlc'>
                        <div className='admin-general__input-title'>Прошлая цена: </div>
                        <input type="number" step={0.01} onWheel={(e) => e.currentTarget.blur()} min={0} className='admin-general__input' value={localStore.product.oldPrice} onChange={(v) => localStore.product.oldPrice = Number(v.target.value)} />
                    </div>
                    <div className='product-editor__input-wrap rlc'>
                        <div className='admin-general__input-title'>Количество: </div>
                        {localStore.product.count !== undefined ?
                            <input type="number" onWheel={(e) => e.currentTarget.blur()} min={0} className='admin-general__input' value={localStore.product.count} onChange={(v) => localStore.product.count = Number(v.target.value)} />
                            :
                            <div className='admin-general__input'>Загрузка ...</div>
                        }
                    </div>
                    <div className='product-editor__input-wrap rlc'>
                        <div className='admin-general__input-title'>Количество на заказ: </div>
                        <input type="number" onWheel={(e) => e.currentTarget.blur()} min={0} className='admin-general__input' value={localStore.product.maxByOrder} onChange={(v) => localStore.product.maxByOrder = Number(v.target.value)} />
                    </div>
                    <div className='product-editor__input-wrap rlc'>
                        <div className='admin-general__input-title'>Новый ?: </div>
                        <Checkbox checked={localStore.product.isNew} onChange={toggleIsNew} />
                    </div>
                    <div className='admin-general__subtitle'>Характеристики</div>
                    <ul className='product-editor__attributes clc'>
                        {localStore.product.attributes.map(attr => (
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
                    "admin-general__action-btn_inactive": !validate()
                })} onClick={onAccept}>Сохранить</div>
                {localStore.product.id !== -1 && <div className={'admin-general__action-btn admin-general__action-btn_delete ccc'} onClick={onDelete}>Удалить</div>}
            </div>
            <div className='admin-general__line'></div>
            <div className='admin-general__subtitle'>Предпросмотр</div>
            <div className='product-editor__prev rct'>
                <div className='product-editor__prev-product product-editor__prev-product_quick-view'>
                    <ProductCard product={localStore.product} type='full-view' />
                </div>
                <div className='product-editor__prev-product product-editor__prev-product_small'>
                    <ProductCard product={localStore.product} type='small' />
                </div>
            </div>
        </div>
    )
});

export default ProductEditor