import React, { ChangeEvent, useEffect, useRef } from 'react'
import FileUploader from '../../../../lib/components/FileUploader/FileUploader'
import BannerList from '../../../home/components/BannerList'
import '../../../../styles/admin/admin-general.scss';
import './home-editor.scss';
import '../../../home/home.scss';
import UploadArea from '../../components/UploadArea';
import { IBanner } from '../../../../types/ILargeBanner';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { IContact } from '../../../../types/IContact';
import Selector from '../../../../lib/components/Selector/Selector';
import shop from '../../../../store/shop';
import { ICategory } from '../../../../types/ICategory';
import Checkbox from '../../../../lib/components/Checkbox/Checkbox';
import Loader from '../../../../lib/components/Loader/Loader';
import Banner from '../../../home/components/Banner';
import catalog from '../../../../store/catalog';
import product from '../../../../store/product';

interface LocalStore {
    banner: IBanner;
    bannerImgFile?: File;
    contacts: IContact[];
    isLoading: boolean;
}

const HomeEditor = observer(() => {
    const inputRef = useRef<HTMLInputElement>(null);
    const smallBannerUploader = useRef<HTMLInputElement>(null);
    const getBannerTemplate = (): IBanner => {
        return {
            id: -1,
            title: '',
            subtitle: '',
            link: '',
            img: ''
        }
    }

    const localStore = useLocalObservable<LocalStore>(() => ({
        banner: getBannerTemplate(),
        contacts: [],
        isLoading: true
    }))

    useEffect(() => {
        async function fetchInfo() {
            await shop.fetchAllInfo();
            localStore.contacts = JSON.parse(JSON.stringify(shop.contacts));
            localStore.isLoading = false;
        }

        localStore.isLoading = true;
        fetchInfo()
    }, [])

    useEffect(() => {
        if (catalog.categories.length !== 0) {
            product.fetchProducts(catalog.categories[0].routeName)
        }
    }, [catalog.categories]);

    const getSelectorCategories = (categories: ICategory[]) => {
        const categoryValues = new Map<string, string>();
        for (const category of categories) {
            categoryValues.set(category.id.toString(), category.name);
        }

        return categoryValues;
    }

    const onAcceptContacts = async () => {
        await shop.editContacts(localStore.contacts);
        localStore.contacts = JSON.parse(JSON.stringify(shop.contacts));
    }

    const onResetContacts = () => {
        localStore.contacts = JSON.parse(JSON.stringify(shop.contacts));
    }

    const onUploadBannerImg = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const image = e.target.files[0];
            localStore.bannerImgFile = image;
            localStore.banner.img = URL.createObjectURL(image);

            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    }

    const onUploadSmallBannerImg = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const image = e.target.files[0];
            shop.editSmallBanner(image);

            if (smallBannerUploader.current) {
                smallBannerUploader.current.value = '';
            }
        }
    }

    const onSelectBanner = (banner: IBanner) => {
        localStore.banner = JSON.parse(JSON.stringify(banner));
    }

    const onAcceptBanner = async () => {
        if (!validateBanner()) {
            return;
        }

        if (localStore.banner.id == -1) {
            if (localStore.bannerImgFile) {
                await shop.addBanner(localStore.banner, localStore.bannerImgFile);
            }
        } else {
            await shop.editBanner(localStore.banner, localStore.bannerImgFile)
        }

        onClearBanner();
    }

    const onClearBanner = () => {
        localStore.banner = getBannerTemplate();
        localStore.bannerImgFile = undefined;
    }

    const onDeleteBanner = async () => {
        await shop.deleteBanner(localStore.banner.id);
        onClearBanner();
    }

    const validateBanner = () => {
        return (localStore.bannerImgFile || localStore.banner.id !== -1) && localStore.banner.link !== '' && localStore.banner.subtitle !== '' && localStore.banner.title !== ''
    }

    const onSelectCategory = (categoryId: string) => {
        const category = catalog.getCategoryById(Number(categoryId));
        if (category) {
            product.fetchProducts(category.routeName);
        }
    }

    if (localStore.isLoading) {
        return (
            <div className='home-editor__loader ccc'>
                <Loader />
            </div>
        )
    }

    return (
        <div className='home-editor'>
            <div className='admin-general__title'>Редактор главной страницы</div>
            <div className='home-editor__banner clc'>
                <div className='admin-general__subtitle'>Большие банеры в главном меню</div>
                <div className='home-editor__banner-view'>
                    <BannerList banners={shop.banners} bannerSize="container" onClick={onSelectBanner} />
                </div>
                <div className='home-editor__banner-view-head rcc'>
                    <div className='admin-general__subtitle'>Редактор баннера</div>
                    <div className='admin-general__clear-btn' onClick={onClearBanner}>Очистить</div>
                </div>

                {localStore.banner.img == '' ?
                    <div className='home-editor__uploader-wrap ccc'>
                        <FileUploader inputRef={inputRef} className='home-editor__uploader ссс' onUploadImage={onUploadBannerImg} multiple={false} >
                            <UploadArea />
                        </FileUploader>
                    </div>
                    :
                    <div className='home-editor__banner-view'>
                        <FileUploader inputRef={inputRef} className='home-editor__file-uploader' onUploadImage={onUploadBannerImg} multiple={false} >
                            <Banner info={localStore.banner} size="container" />
                        </FileUploader>
                    </div>
                }
                <div className='home-editor__input-row rcc'>
                    <span className='admin-general__input-title'>Заголовок: </span>
                    <textarea className='admin-general__input' value={localStore.banner.title} onChange={(v) => localStore.banner.title = v.target.value} />
                </div>
                <div className='home-editor__input-row rcc'>
                    <span className='admin-general__input-title'>Подзаголовок: </span>
                    <input className='admin-general__input' value={localStore.banner.subtitle} onChange={(v) => localStore.banner.subtitle = v.target.value} />
                </div>
                <div className='home-editor__input-row rcc'>
                    <span className='admin-general__input-title'>Ссылка <br></br>(без домену к примеру /home): </span>
                    <input className='admin-general__input' value={localStore.banner.link} onChange={(v) => localStore.banner.link = v.target.value} />
                </div>
                <div className='rcc home-editor__btn-row'>
                    <div className='admin-general__action-btn admin-general__action-btn_accept ccc' onClick={onAcceptBanner}>Accept</div>
                    {localStore.banner.id !== -1 && <div className='admin-general__action-btn admin-general__action-btn_delete ccc' onClick={onDeleteBanner}>Delete</div>}
                </div>
            </div>
            <div className='home-editor__small-banners'>
                <div className='admin-general__subtitle'>Маленький банер</div>
                <FileUploader inputRef={smallBannerUploader} className='home-editor__file-uploader' onUploadImage={onUploadSmallBannerImg} multiple={false}>
                    <img className='home-editor__small-banner' src={shop.smallBanner == '' ? require('../../../../assets/images/no-photo2.png') : shop.smallBanner} />
                </FileUploader>
            </div>
            <div className='home-editor__contacts'>
                <div className='admin-general__subtitle'>Контакты</div>
                {localStore.contacts.map(contact => (
                    <div key={contact.name} className='home-editor__input-row  rcc'>
                        <span className='admin-general__input-title'>{contact.name}: </span>
                        <input className='admin-general__input' value={contact.url} onChange={(v) => contact.url = v.target.value} />
                    </div>
                ))}
                <div className='rcc home-editor__btn-row'>
                    <div className='admin-general__action-btn admin-general__action-btn_accept ccc' onClick={onAcceptContacts}>Accept</div>
                    <div className='admin-general__action-btn admin-general__action-btn_delete ccc' onClick={onResetContacts}>Reset</div>
                </div>
            </div>
            <div className='home-editor__bestsellers clc'>
                <div className='admin-general__subtitle'>Хиты продаж</div>
                <div className='home-editor__product-filters rlc'>
                    <Selector className='home-editor__selector'
                        hint={''}
                        values={getSelectorCategories(catalog.categories)}
                        selectedId={catalog.categories[0]?.id.toString()}
                        onSelect={onSelectCategory}
                    />
                    <input className='home-editor__search' placeholder='Search ...' />
                </div>
                {product.products.map(p => (
                    <div key={p.id} className='home-editor__product rlc'>
                        <img className='home-editor__product-img' src={p.images.find(img => img.isMain)?.url ?? p.images[0].url} />
                        <span className='home-editor__product-name'>{p.title}</span>
                        <Checkbox className='home-editor__product-checkbox' checked={p.isBestseller} onChange={(v) => product.setBestsellerStatus(p.id, v.target.checked)} />
                    </div>
                ))}
            </div>
        </div>
    )
});

export default HomeEditor