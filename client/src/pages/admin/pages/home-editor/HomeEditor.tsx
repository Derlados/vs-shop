import React, { useEffect } from 'react'
import FileUploader from '../../../../lib/FileUploader/FileUploader'
import BannerList from '../../../home/components/BannerList'
import '../../../../styles/admin/admin-general.scss';
import '../../../../styles/admin/home-editor.scss';
import '../../../../styles/home/home.scss';
import UploadArea from '../../components/UploadArea';
import { ILargeBanner } from '../../../../types/ILargeBanner';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { IContact } from '../../../../types/IContact';
import Selector from '../../../../lib/Selector/Selector';
import shop from '../../../../store/shop';
import { ICategory } from '../../../../types/ICategory';
import catalog from '../../../../store/catalog';
import Checkbox from '../../../../lib/Checkbox/Checkbox';
import Loader from '../../../../lib/Loader/Loader';

interface LocalStore {
    largeBanner: ILargeBanner;
    contacts: IContact[];
    smallBanner: string;
}

const HomeEditor = observer(() => {
    const getLargeBannerTemplate = (): ILargeBanner => {
        return {
            title: '',
            subtitle: '',
            link: '',
            img: ''
        }
    }

    const localStore = useLocalObservable<LocalStore>(() => ({
        largeBanner: getLargeBannerTemplate(),
        contacts: [
            { name: 'Facebook', icon: '', urL: '' },
            { name: 'Telegram', icon: '', urL: '' },
            { name: 'Instagram', icon: '', urL: '' },
        ],
        smallBanner: ''
    }))

    useEffect(() => {
        if (shop.categories.length !== 0) {
            catalog.init(shop.categories[0].routeName)
        }
    }, [shop.categories]);

    const getSelectorCategories = (categories: ICategory[]) => {
        const categoryValues = new Map<ICategory, string>();
        for (const category of categories) {
            categoryValues.set(category, category.name);
        }

        return categoryValues;
    }

    return (
        <div className='home-editor'>
            <div className='admin-general__title'>Редактор головної сторінки</div>
            <div className='home-editor__banner clc'>
                <div className='admin-general__subtitle'>Великі банери на головному меню</div>
                <BannerList banners={[]} />
                <div className='home-editor__uploader-wrap ccc'>
                    <FileUploader className='home-editor__uploader ссс' onUploadImage={() => { }} >
                        <UploadArea />
                    </FileUploader>
                </div>
                <div className='home-editor__input-row rcc'>
                    <span className='admin-general__input-title'>Заголовок: </span>
                    <input className='admin-general__input' value={localStore.largeBanner.title} onChange={(v) => localStore.largeBanner.title = v.target.value} />
                </div>
                <div className='home-editor__input-row rcc'>
                    <span className='admin-general__input-title'>Підзаголовок: </span>
                    <input className='admin-general__input' value={localStore.largeBanner.subtitle} onChange={(v) => localStore.largeBanner.subtitle = v.target.value} />
                </div>
                <div className='home-editor__input-row rcc'>
                    <span className='admin-general__input-title'>Посилання<br></br>(без домену): </span>
                    <input className='admin-general__input' value={localStore.largeBanner.link} onChange={(v) => localStore.largeBanner.link = v.target.value} />
                </div>
                <div className='rcc home-editor__btn-row'>
                    <div className='admin-general__action-btn admin-general__action-btn_accept ccc'>Accept</div>
                    <div className='admin-general__action-btn admin-general__action-btn_delete ccc'>Clear</div>
                </div>
            </div>
            <div className='home-editor__small-banners'>
                <div className='admin-general__subtitle'>Малий банер</div>
                <FileUploader className='home-editor__file-uploader' onUploadImage={() => { }} >
                    <img className='home-editor__small-banner' src={localStore.smallBanner == '' ? require('../../../../assets/images/no-photo2.png') : localStore.smallBanner} />
                </FileUploader>
            </div>
            <div className='home-editor__contacts'>
                <div className='admin-general__subtitle'>Контакти</div>
                {localStore.contacts.map(c => (
                    <div key={c.name} className='rcc'>
                        <span className='admin-general__input-title'>{c.name}: </span>
                        <input className='admin-general__input' value={c.urL} onChange={(v) => c.urL = v.target.value} />
                    </div>
                ))}
                <div className='rcc home-editor__btn-row'>
                    <div className='admin-general__action-btn admin-general__action-btn_accept ccc'>Accept</div>
                    <div className='admin-general__action-btn admin-general__action-btn_delete ccc'>Clear</div>
                </div>
            </div>
            <div className='home-editor__bestsellers clc'>
                <div className='admin-general__subtitle'>Хіти продаж</div>
                <div className='home-editor__product-filters rlc'>
                    <Selector className='home-editor__selector' hint={''} values={getSelectorCategories(shop.categories)} selectedValue={shop.categories[0]?.name} onSelect={() => { }} />
                    <input className='home-editor__search' placeholder='Search ...' />
                </div>
                {catalog.filteredProducts.map(p => (
                    <div key={p.id} className='home-editor__product rlc'>
                        <img className='home-editor__product-img' src={p.images.find(img => img.isMain)?.url ?? p.images[0].url} />
                        <span className='home-editor__product-name'>{p.title}</span>
                        <Checkbox className='home-editor__product-checkbox' checked={true} onChange={() => { }} />
                    </div>
                ))}
            </div>
        </div>
    )
});

export default HomeEditor