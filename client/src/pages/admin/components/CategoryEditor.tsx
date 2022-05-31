import React from 'react'
import shop from '../../../store/shop';
import '../../../styles/home/home.scss';
import '../../../styles/admin/category-editor.scss';
import { NavLink } from 'react-router-dom';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { ICategory } from '../../../types/ICategory';
import { nanoid } from 'nanoid';

interface IKeyAttribute {
    id: string;
    value: string;
}

interface LocalStore {
    id: number;
    name: string;
    routeName: string;
    attributes: IKeyAttribute[];
}

const CategoryEditor = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        id: -1,
        name: '',
        routeName: '',
        attributes: [{ id: nanoid(), value: '' }]
    }))

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
        console.log(localStore.attributes.map(a => a.value));
    }

    return (
        <div className='category-editor clt'>
            <div className='category-editor__title'>Categories</div>
            <div className='category-editor__created-categories rlc'>
                {shop.categories.map((category) => (
                    <div key={category.routeName} className='home__category-card rlc'>
                        <div className='home__category-text'>
                            <div className='home__category-name'>{category.name}</div>
                            <div className='home__category-count-products'>Products ({category.products})</div>
                            <NavLink className='home__category-shop-now' to={`/${category.routeName}`}>Shop now</NavLink>
                        </div>
                        <img className='home__category-img' alt='' src={category.img} />
                    </div>
                ))}
            </div>
            <div className='category-editor__line'></div>
            <div className='category-editor__form rlt'>
                <div className='category-editor__left-form clc'>
                    <div className='category-editor__edit-img-cont'>
                        <div className='category-editor__edit-img'></div>
                    </div>
                    <div className='category-editor__accept-btn ccc' onClick={onAccept}>Accept</div>
                </div>
                <div className='category-editor__right-form clt'>
                    <div className='category-editor__name'>Name and URL</div>
                    <input className='category-editor__input' placeholder='category name' value={localStore.name} onChange={(v) => localStore.name = v.target.value} />
                    <input className='category-editor__input' placeholder='category url name' value={localStore.routeName} onChange={(v) => localStore.routeName = v.target.value} />
                    <div className='category-editor__key-attrs'>Key attributes</div>
                    <ul className='category-editor__key-attr-list'>
                        {localStore.attributes.map((attr, index) => (
                            <li key={attr.id} className='category-editor__key-attr-item rlc'>
                                <input className='category-editor__input' placeholder='attribute name' value={attr.value} onChange={(v) => onChangeAttr(index, v.target.value)} />
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