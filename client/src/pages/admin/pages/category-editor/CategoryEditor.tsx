import React, { ChangeEvent, ChangeEventHandler, useRef } from 'react'
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


interface IKeyAttribute {
    id: string;
    value: string;
}

interface LocalStore {
    id: number;
    name: string;
    routeName: string;
    attributes: IKeyAttribute[];
    imgUrl?: string;
    img?: File;
}

const CategoryEditor = observer(() => {
    const inputRef = useRef<HTMLInputElement>(null);
    const localStore = useLocalObservable<LocalStore>(() => ({
        id: -1,
        name: '',
        routeName: '',
        attributes: [{ id: nanoid(), value: '' }]
    }))

    const validate = (): boolean => {
        if (!localStore.name || !localStore.routeName || localStore.attributes.length == 1) {
            return false;
        }

        if (localStore.id == -1 && !localStore.img) {
            return false;
        }

        return true;
    }

    const deleteAttr = (index: number) => {
        localStore.attributes.splice(index, 1);
    }

    const onChangeAttr = (index: number, newValue: string) => {
        localStore.attributes[index].value = newValue;
        if (localStore.attributes[localStore.attributes.length - 1].value !== '') {
            localStore.attributes.push({ id: nanoid(), value: '' });
        }

        if (localStore.attributes[localStore.attributes.length - 2].value === '') {
            localStore.attributes.pop()
        }

    }

    const onAccept = () => {
        if (!validate()) {
            return;
        }

        const categoryDto: CreateCategoryDto = {
            name: localStore.name,
            routeName: localStore.routeName,
            attributes: localStore.attributes.map(a => {
                return {
                    name: a.value,
                    isRange: false
                }
            })
        }
        categoryDto.attributes = categoryDto.attributes.filter(a => a.name !== '');

        if (localStore.id == -1) {
            if (localStore.img) {
                shop.addCategory(categoryDto, localStore.img);
            }
        } else {
            shop.editCategory(localStore.id, categoryDto, localStore.img);
        }

        onClear();
    }

    const onClear = () => {
        localStore.id = -1;
        localStore.name = localStore.routeName = localStore.imgUrl = '';
        localStore.attributes = [{ id: nanoid(), value: '' }];
        localStore.img = undefined;
    }

    const onEdit = (category: ICategory) => {
        localStore.id = category.id;
        localStore.name = category.name;
        localStore.routeName = category.routeName;
        localStore.imgUrl = category.img;
        localStore.attributes = category.keyAttributes.map(attr => { return { id: attr.id.toString(), value: attr.name } });
        localStore.attributes.push({ id: nanoid(), value: '' })
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

    const onDelete = (id: number) => {
        shop.deleteCategory(id);
        onClear();
    }

    return (
        <div className='category-editor clt'>
            <div className='admin-general__title'>Редактор каталогів</div>
            <div className='category-editor__created-categories rlc'>
                {shop.categories.map((category) => (
                    <CategoryCard key={category.routeName} category={category} onClick={() => onEdit(category)} />
                ))}
            </div>
            <div className='category-editor__line'></div>
            <div className='category-editor__form rlt'>
                <div className='category-editor__left-form clc'>
                    <FileUploader inputRef={inputRef} className='category-editor__edit-img-cont' onUploadImage={onUploadImage}>
                        {!localStore.imgUrl ?
                            <div className='category-editor__edit-img-border'>
                                <div className='category-editor__edit-img admin-general__edit-img-icon'></div>
                            </div>
                            :
                            <img className='category-editor__edit-img' src={localStore.imgUrl} />
                        }
                    </FileUploader>
                    <div className={classNames('admin-general__action-btn admin-general__action-btn_accept ccc', {
                        "admin-general__action-btn_inactive": !validate()
                    })} onClick={onAccept}>Accept</div>
                    {localStore.id !== -1 && <div className='category-editor__action-btn category-editor__action-btn_delete ccc' onClick={() => onDelete(localStore.id)}>Delete</div>}
                </div>
                <div className='category-editor__right-form clt'>
                    <div className='category-editor__editor-head rlt'>
                        <div className='category-editor__name'>Ім'я та посилання</div>
                        <div className='admin-general__clear-btn' onClick={onClear}>Clear</div>
                    </div>
                    <input className='admin-general__input' placeholder='category name' value={localStore.name} onChange={(v) => localStore.name = v.target.value} />
                    <input className='admin-general__input' placeholder='category url name' value={localStore.routeName} onChange={(v) => localStore.routeName = v.target.value} />
                    <div className='category-editor__key-attrs'>Ключові атрибути</div>
                    <ul className='category-editor__key-attr-list'>
                        {localStore.attributes.map((attr, index) => (
                            <li key={attr.id} className='category-editor__key-attr-item rlc'>
                                <input className='admin-general__input' placeholder='attribute name' value={attr.value} onChange={(v) => onChangeAttr(index, v.target.value)} />
                                {localStore.attributes.length !== index + 1 && <div className='category-editor__del-attr ccc' onClick={() => deleteAttr(index)}>X</div>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
});

export default CategoryEditor