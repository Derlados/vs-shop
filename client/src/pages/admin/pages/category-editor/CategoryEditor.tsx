import React, { ChangeEvent, ChangeEventHandler, useEffect, useRef } from 'react'
import shop from '../../../../store/shop';
import '../../../home/home.scss';
import './category-editor.scss';
import '../../../../styles/admin/admin-general.scss';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { ICategory } from '../../../../types/ICategory';
import { nanoid } from 'nanoid';
import { CreateCategoryDto } from '../../../../services/categories/dto/create-category.dto';
import classNames from 'classnames';
import CategoryCard from '../../../../components/Category/CategoryList/CategoryCard';
import FileUploader from '../../../../lib/components/FileUploader/FileUploader';
import Checkbox from '../../../../lib/components/Checkbox/Checkbox';
import catalog from '../../../../store/catalog';
import Selector from '../../../../lib/components/Selector/Selector';
import { ICatalog } from '../../../../types/ICatalog';
import catalogEditorStore, { CatalogEditorStoreStatus } from '../../../../store/catalog-editor/catalog-editor.store';
import Loader from '../../../../lib/components/Loader/Loader';


interface IKeyAttribute {
    id: string;
    value: string;
}

interface ICategoryTemplate {
    id: number;
    catalogId: number;
    name: string;
    routeName: string;
    isNew: boolean;
    attributes: IKeyAttribute[];
}

interface ICatalogTemplate {
    id: number;
    name: string;
}

interface LocalStore {
    category: ICategoryTemplate;
    catalog: ICatalogTemplate;
    imgUrl?: string;
    img?: File;
}

const CategoryEditor = observer(() => {
    const inputRef = useRef<HTMLInputElement>(null);
    const localStore = useLocalObservable<LocalStore>(() => ({
        category: {
            id: -1,
            catalogId: -1,
            name: '',
            routeName: '',
            isNew: false,
            attributes: [{ id: nanoid(), value: '' }],
        },
        catalog: {
            id: -1,
            name: ''
        }
    }));

    useEffect(() => {
        catalogEditorStore.init();
    }, [])


    const validate = (): boolean => {
        if (!localStore.category.name || !localStore.category.routeName
            || localStore.category.attributes.length === 1 || localStore.category.catalogId === -1) {
            return false;
        }

        if (localStore.category.id == -1 && !localStore.img) {
            return false;
        }

        return true;
    }

    const deleteAttr = (index: number) => {
        localStore.category.attributes.splice(index, 1);
    }

    const onChangeAttr = (index: number, newValue: string) => {
        localStore.category.attributes[index].value = newValue;
        if (localStore.category.attributes[localStore.category.attributes.length - 1].value !== '') {
            localStore.category.attributes.push({ id: nanoid(), value: '' });
        }

        if (localStore.category.attributes[localStore.category.attributes.length - 2].value === '') {
            localStore.category.attributes.pop()
        }

    }

    const toggleIsNew = () => {
        localStore.category.isNew = !localStore.category.isNew;
    }

    const onUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            localStore.img = e.target.files[0];
            localStore.imgUrl = URL.createObjectURL(localStore.img);

            // Очистка input от файла (чтобы при очищении файла мог отобразится тот же файл при загрузке)
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }

    }

    const onAccept = () => {
        if (!validate()) {
            return;
        }

        const { id: categoryId, attributes, ...categoryData } = localStore.category;
        const categoryDto: CreateCategoryDto = {
            ...categoryData,
            attributes: attributes.filter(a => a.value !== '').map(a => {
                return {
                    name: a.value,
                    isRange: false
                }
            })
        }

        if (categoryId == -1) {
            if (localStore.img) {
                catalogEditorStore.addCategory(categoryDto, localStore.img);
            }
        } else {
            catalogEditorStore.editCategory(categoryId, categoryDto, localStore.img);
        }

        onClear();
    }

    const onSelectCatalog = (catalogId: string) => {
        localStore.category.catalogId = Number(catalogId);
    }

    const onClear = () => {
        localStore.category = {
            id: -1,
            catalogId: -1,
            name: '',
            routeName: '',
            isNew: false,
            attributes: [{ id: nanoid(), value: '' }],
        };
        localStore.img = undefined;
        localStore.imgUrl = undefined;
    }

    const onEdit = (category: ICategory) => {
        const { keyAttributes, productsCount, ...categoryData } = category;
        const attributes = category.keyAttributes.map(attr => { return { id: attr.id.toString(), value: attr.name } });
        attributes.push({ id: nanoid(), value: '' })
        localStore.category = { ...categoryData, attributes: attributes };
        localStore.imgUrl = category.img;
    }

    const onDelete = (id: number, catalogId: number) => {
        catalogEditorStore.deleteCategory(id, catalogId);
        onClear();
    }

    const getCatalogValues = (catalogs: ICatalog[]) => {
        const values = new Map<string, string>();

        for (const catalog of catalogs) {
            values.set(catalog.id.toString(), catalog.name);
        }

        return values;
    }


    //////////////////////// РЕДАКТОР КАТАЛОГА //////////////////////////

    const onSelectCatalogToEdit = (catalogId: number) => {
        const editedCatalog = catalog.catalogs.find(c => c.id === catalogId);
        if (editedCatalog) {
            onClearCatalogEditor();
            const { categories, ...catalogData } = editedCatalog;
            localStore.catalog = catalogData;
        }

    }

    const onChangeCatalogName = (newName: string) => {
        localStore.catalog.name = newName;
    }

    const onAcceptCatalog = () => {
        if (localStore.catalog.id === -1) {
            catalogEditorStore.addCatalog(localStore.catalog.name);
        } else {
            catalogEditorStore.editCatalog(localStore.catalog.id, localStore.catalog.name);
        }

        onClearCatalogEditor();
    }

    const onDeleteCatalog = (catalogId: number) => {
        catalogEditorStore.deleteCatalog(catalogId);

        if (localStore.catalog.id === catalogId) {
            onClearCatalogEditor();
        }
    }

    const onClearCatalogEditor = () => {
        localStore.catalog = { id: -1, name: '' }
    }

    if (catalogEditorStore.status === CatalogEditorStoreStatus.initial || catalogEditorStore.status === CatalogEditorStoreStatus.loading) {
        return (
            <div className='category-editor__loader ccc'>
                <Loader />
            </div>
        );
    }

    return (
        <div className='category-editor clt'>
            <div className='admin-general__title'>Редактор каталогов и категорий</div>
            <div className='category-editor__created-categories rlc'>
                {catalogEditorStore.categories.map((category) => (
                    <CategoryCard key={category.routeName} category={category} onClick={() => onEdit(category)} />
                ))}
            </div>
            <div className='admin-general__title'>Список каталогов</div>
            <div className='category-editor__catalogs'>
                <div className='category-editor__catalog-editor rlc'>
                    <input className='admin-general__input'
                        placeholder={localStore.catalog.id === -1 ? 'Введите название нового каталога' : `Введите новое название для каталога --${catalogEditorStore.catalogs.find(c => c.id !== localStore.catalog.id)?.name}`}
                        value={localStore.catalog.name}
                        onChange={(e) => onChangeCatalogName(e.target.value)}
                    />
                    <div className='category-editor__catalog-editor-btns rlc'>
                        <div className='category-editor__catalog-editor-btn admin-general__btn admin-general__btn_add' onClick={onAcceptCatalog}>
                            {localStore.catalog.id === -1 ? 'Добавить' : 'Изменить'}
                        </div>
                        <div className='category-editor__catalog-editor-btn admin-general__btn admin-general__btn_add' onClick={onClearCatalogEditor}>
                            Очистить
                        </div>
                    </div>

                </div>
                <ul className='category-editor__catalogs-list'>
                    {catalogEditorStore.catalogs.map(c => (
                        <li key={c.id} className='category-editor__catalog-item rlc'  >
                            <div className='category-editor__catalog-name' onClick={() => onSelectCatalogToEdit(c.id)}>{c.name}</div>
                            <div className='category-editor__catalog-del-wrapper ccc' onClick={() => onDeleteCatalog(c.id)}>
                                <div className='category-editor__catalog-del admin-general__btn-icon admin-general__btn-icon_del'></div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='admin-general__title'>Создание категории</div>
            <div className='category-editor__form rlt'>
                <div className='category-editor__left-form clc'>
                    <FileUploader inputRef={inputRef} className='category-editor__edit-img-cont ccc' onUploadImage={onUploadImage}>
                        {!localStore.imgUrl ?
                            <div className='category-editor__edit-img-border'>
                                <div className='category-editor__edit-img admin-general__edit-img-icon'></div>
                            </div>
                            :
                            <img className='category-editor__edit-img' src={localStore.imgUrl} />
                        }
                    </FileUploader>
                    <div className='category-editor__desctop-actions ccc'>
                        <div className={classNames('admin-general__action-btn admin-general__action-btn_accept ccc', {
                            "admin-general__action-btn_inactive": !validate()
                        })} onClick={onAccept}>Сохранить</div>
                        {localStore.category.id !== -1 &&
                            <div className='category-editor__action-btn category-editor__action-btn_delete ccc'
                                onClick={() => onDelete(localStore.category.id, localStore.category.catalogId)}>
                                Удалить
                            </div>
                        }
                    </div>
                </div>
                <div className='category-editor__right-form clt'>
                    <div className='category-editor__editor-head rlt'>
                        <div className='category-editor__name'>Основная информация</div>
                        <div className='admin-general__clear-btn' onClick={onClear}>Очистить</div>
                    </div>

                    <input className='admin-general__input' placeholder='Имя категории' value={localStore.category.name} onChange={(v) => localStore.category.name = v.target.value} />
                    <input className='admin-general__input' placeholder='Имя категории на английском (маленькие буквы)' value={localStore.category.routeName} onChange={(v) => localStore.category.routeName = v.target.value} />
                    <Selector
                        className='admin-general__selector'
                        hint='Выберите каталог'
                        innerHint={true}
                        values={getCatalogValues(catalog.catalogs)}
                        onSelect={onSelectCatalog}
                        selectedId={localStore.category.catalogId.toString()}
                    />
                    <div className='rlc'>
                        <div className='admin-general__input-title category-editor__is-new'>Новинка ?: </div>
                        <Checkbox checked={localStore.category.isNew} onChange={toggleIsNew} />
                    </div>

                    <div className='category-editor__key-attrs'>Ключевые аттрибуты</div>
                    <ul className='category-editor__key-attr-list'>
                        {localStore.category.attributes.map((attr, index) => (
                            <li key={attr.id} className='category-editor__key-attr-item rlc'>
                                <input className='admin-general__input' placeholder='Имя аттрибута' value={attr.value} onChange={(v) => onChangeAttr(index, v.target.value)} />
                                {localStore.category.attributes.length !== index + 1 && <div className='category-editor__del-attr ccc' onClick={() => deleteAttr(index)}>X</div>}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='category-editor__mobile-actions ccc'>
                    <div className={classNames('admin-general__action-btn admin-general__action-btn_accept ccc', {
                        "admin-general__action-btn_inactive": !validate()
                    })} onClick={onAccept}>Сохранить</div>
                    {localStore.category.id !== -1 && <div className='category-editor__action-btn category-editor__action-btn_delete ccc' onClick={() => onDelete(localStore.category.id, localStore.category.catalogId)}>Удалить</div>}
                </div>
            </div>
        </div>
    )
});

export default CategoryEditor