import React, { ChangeEvent, useEffect, useRef } from 'react'
import FileUploader from '../../../../lib/FileUploader/FileUploader'
import BannerList from '../../../home/components/BannerList'
import '../../../../styles/admin/admin-general.scss';
import './home-editor.scss';
import '../../../home/home.scss';
import UploadArea from '../../components/UploadArea';
import { IBanner } from '../../../../types/ILargeBanner';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { IContact } from '../../../../types/IContact';
import Selector from '../../../../lib/Selector/Selector';
import shop from '../../../../store/shop';
import { ICategory } from '../../../../types/ICategory';
import catalog from '../../../../store/catalog';
import Checkbox from '../../../../lib/Checkbox/Checkbox';
import Loader from '../../../../lib/Loader/Loader';
import Banner from '../../../home/components/Banner';

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

    if (localStore.isLoading) {
        return (
            <div className='home-editor__loader ccc'>
                <Loader />
            </div>
        )
    }

    return (
        <div className='home-editor'>
            <div className='admin-general__title'>Редактор головної сторінки</div>
            <div className='home-editor__banner clc'>
                <div className='admin-general__subtitle'>Великі банери на головному меню</div>
                <div className='home-editor__banner-view'>
                    <BannerList banners={shop.banners} bannerSize="container" onClick={onSelectBanner} />
                </div>
                <div className='home-editor__banner-view-head rcc'>
                    <div className='admin-general__subtitle'>Створення нового або редагування</div>
                    <div className='admin-general__clear-btn' onClick={onClearBanner}>Clear</div>
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
                    <span className='admin-general__input-title'>Підзаголовок: </span>
                    <input className='admin-general__input' value={localStore.banner.subtitle} onChange={(v) => localStore.banner.subtitle = v.target.value} />
                </div>
                <div className='home-editor__input-row rcc'>
                    <span className='admin-general__input-title'>Посилання<br></br>(без домену): </span>
                    <input className='admin-general__input' value={localStore.banner.link} onChange={(v) => localStore.banner.link = v.target.value} />
                </div>
                <div className='rcc home-editor__btn-row'>
                    <div className='admin-general__action-btn admin-general__action-btn_accept ccc' onClick={onAcceptBanner}>Accept</div>
                    {localStore.banner.id !== -1 && <div className='admin-general__action-btn admin-general__action-btn_delete ccc' onClick={onDeleteBanner}>Delete</div>}
                </div>
            </div>
            <div className='home-editor__small-banners'>
                <div className='admin-general__subtitle'>Малий банер</div>
                <FileUploader inputRef={smallBannerUploader} className='home-editor__file-uploader' onUploadImage={onUploadSmallBannerImg} multiple={false}>
                    <img className='home-editor__small-banner' src={shop.smallBanner == '' ? require('../../../../assets/images/no-photo2.png') : shop.smallBanner} />
                </FileUploader>
            </div>
            <div className='home-editor__contacts'>
                <div className='admin-general__subtitle'>Контакти</div>
                {localStore.contacts.map(contact => (
                    <div key={contact.name} className='rcc'>
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
                <div className='admin-general__subtitle'>Хіти продаж</div>
                <div className='home-editor__product-filters rlc'>
                    <Selector className='home-editor__selector' hint={''} values={getSelectorCategories(shop.categories)} selectedValue={shop.categories[0]?.name} onSelect={() => { }} />
                    <input className='home-editor__search' placeholder='Search ...' />
                </div>
                {catalog.filteredProducts.map(p => (
                    <div key={p.id} className='home-editor__product rlc'>
                        <img className='home-editor__product-img' src={p.images.find(img => img.isMain)?.url ?? p.images[0].url} />
                        <span className='home-editor__product-name'>{p.title}</span>
                        <Checkbox className='home-editor__product-checkbox' checked={p.isBestseller} onChange={(v) => catalog.setBestsellerStatus(p.id, v.target.checked)} />
                    </div>
                ))}
            </div>
        </div>
    )
});

export default HomeEditor