import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { customAlphabet, nanoid } from 'nanoid';
import { ChangeEvent, useEffect, useRef } from 'react';
import CategoryList from '../../../../components/CategoryList';
import FileUploader from '../../../../lib/FileUploader/FileUploader';
import catalog from '../../../../store/catalog';
import shop from '../../../../store/shop';
import '../../../../styles/admin/admin-general.scss';
import '../../../../styles/admin/product-editor.scss';
import { ICategory } from '../../../../types/ICategory';
import { IImage } from '../../../../types/IImage';
import { IProduct } from '../../../../types/IProduct';
import { REGEX } from '../../../../values/regex';
import Product from '../../../shop/components/product-card/Product';
import { ViewMode } from '../../../shop/components/ProductCatalog';
import ProductGrid from '../../../shop/components/ProductGrid';

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
            description: '',
            price: 0,
            oldPrice: 0,
            isNew: false,
            count: 0,
            discountPercent: 0,
            attributes: new Map<string, string>(),
            images: []
        }
    }))
    localStore.product.discountPercent = Math.floor((1 - localStore.product.price / localStore.product.oldPrice) * 100);

    const getProductTemplate = () => {
        const attributes = new Map<string, string>();
        if (localStore && localStore.selectedCategory) {
            for (const attr of localStore.selectedCategory.keyAttributes) {
                attributes.set(attr.name, '');
            }
        }

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
        if (shop.categories[0]) {
            onSelectCategory(shop.categories[0])
        }
    }, [shop.categories]);

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
            catalog.addProduct(localStore.product, files, localStore.deletedImagesId, newMainImageId);
        } else {
            catalog.editProduct(localStore.product.id, localStore.product, files, localStore.deletedImagesId, newMainImageId);
        }

        onClear();
    }

    const onEdit = (product: IProduct) => {
        localStore.product = { ...product, images: JSON.parse(JSON.stringify(product.images)) }
        localStore.uploadedFiles = [];
        localStore.deletedImagesId = [];
    }

    const onSelectCategory = (category: ICategory) => {
        catalog.init(category.routeName);
        localStore.selectedCategory = category;
        onClear();
    }

    const onClear = () => {
        localStore.product = getProductTemplate();
        localStore.uploadedFiles = [];
        localStore.deletedImagesId = [];
    }

    const onDelete = () => {
        catalog.deleteProduct(localStore.product.id);
        onClear();
    }

    const validate = (): boolean => {
        const { title, description, price, oldPrice, attributes } = localStore.product;
        if (!title || !description || !price || !oldPrice) {
            return false;
        }

        for (const value of attributes.values()) {
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
            <div className='product-editor__product-list'>
                <div className='admin-general__subtitle'>Товари у каталозі "{localStore.selectedCategory?.name}"</div>
                <ProductGrid products={catalog.products} viewMode={ViewMode.GRID} maxPerPage={MAX_PRODUCTS_BY_PAGE} onSelectProduct={onEdit} />
            </div>
            <div className='admin-general__line'></div>
            <div className='product-editor__form'>
                <div className='product-editor__form-head rlc'>
                    <div className='admin-general__subtitle'>Голов1не</div>
                    <div className='admin-general__clear-btn' onClick={onClear}>Clear</div>
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
                        </div>}
                </div>
                <div className='product-editor__chars'>
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
                        <input type="number" step={0.01} onWheel={(e) => e.currentTarget.blur()} min={0} className='admin-general__input' value={localStore.product.price ?? ''} onChange={(v) => localStore.product.price = Number(v.target.value)} />
                    </div>
                    <div className='rlc'>
                        <div className='admin-general__input-title'>Минула ціна: </div>
                        <input type="number" step={0.01} onWheel={(e) => e.currentTarget.blur()} min={0} className='admin-general__input' value={localStore.product.oldPrice} onChange={(v) => localStore.product.oldPrice = Number(v.target.value)} />
                    </div>
                    <div className='rlc'>
                        <div className='admin-general__input-title'>Кількість: </div>
                        <input type="number" onWheel={(e) => e.currentTarget.blur()} min={0} className='admin-general__input' value={localStore.product.count} onChange={(v) => localStore.product.count = Number(v.target.value)} />
                    </div>
                    <div className='rlc'>
                        <div className='admin-general__input-title'>Новий ?: </div>
                        <label className='admin-general__checkbox-cont rcc'>
                            <input className='admin-general__checkbox' type="checkbox" checked={localStore.product.isNew} onChange={toggleIsNew} />
                            <span className='admin-general__checkmark'></span>
                        </label>

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
                {localStore.product.id !== -1 && <div className={'admin-general__action-btn admin-general__action-btn_delete ccc'} onClick={onDelete}>Delete</div>}
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