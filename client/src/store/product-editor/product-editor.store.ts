import { makeAutoObservable, runInAction } from "mobx";
import { customAlphabet } from "nanoid";
import categoriesService from "../../services/categories/categories.service";
import productsService from "../../services/products/products.service";
import { ICategory } from "../../types/ICategory";
import { IImage } from "../../types/IImage";
import { AvailableStatus, IProduct } from "../../types/IProduct";
import { REGEX } from "../../values/regex";

export interface IUploadedFile {
    id: number;
    file: File;
}

export enum ProductEditorStatus {
    INITIAL, LOADING, SUCCESS, FAILURE, LOADING_PRODUCT, SAVING, FAILURE_SAVING,
}

class ProductEditorStore {
    status: ProductEditorStatus;
    category: ICategory;
    products: IProduct[];
    editedProduct: IProduct;
    uploadedImages: IUploadedFile[];
    deletedImageIds: number[];

    get isValid(): boolean {
        if (this.uploadedImages.length == 0 && this.editedProduct.images.length == 0) {
            return false;
        }

        const { title, brand, description, price, oldPrice, attributes } = this.editedProduct;
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

    get mainImage(): IImage {
        let mainImg = this.editedProduct.images.find(img => img.isMain)
        if (!mainImg) {
            this.editedProduct.images[0].isMain = true;
            mainImg = this.editedProduct.images[0];
        }

        return mainImg;
    }

    constructor() {
        makeAutoObservable(this);
        this.status = ProductEditorStatus.INITIAL;
        this.editedProduct = this.createEmptyTemplate();
        this.uploadedImages = [];
        this.deletedImageIds = [];
    }

    async onCategorySelected(category: ICategory) {
        runInAction(() => this.status = ProductEditorStatus.LOADING);

        try {
            const products = await productsService.getProductsByCategory(category.id);

            runInAction(() => {
                this.clear();
                this.category = category;
                this.products = products;
                this.status = ProductEditorStatus.SUCCESS;
            });
        } catch (e) {
            runInAction(() => this.status = ProductEditorStatus.FAILURE);
        }
    }

    async selectProduct(id: number) {
        runInAction(() => this.status = ProductEditorStatus.LOADING_PRODUCT);

        try {
            const product = await productsService.getProductById(id);

            runInAction(() => {
                this.editedProduct = { ...product, discountPercent: Math.floor((1 - product.price / product.oldPrice) * 100) };
                this.status = ProductEditorStatus.SUCCESS;
            });
        } catch (e) {
            runInAction(() => this.status = ProductEditorStatus.FAILURE);
        }
    }

    async saveProduct() {
        if (!this.isValid) {
            return;
        }

        // Проверка, если главным изображением стало одно из существующих - берет его id, иначе никакое id не передается
        const mainImage = this.mainImage;
        let newMainImageId = undefined;
        if (!REGEX.BLOB.test(mainImage.url)) {
            newMainImageId = mainImage.id;
        }

        const files = this.uploadedImages.map(ui => ui.file)

        if (this.editedProduct.id === -1) {
            this.createProduct(files, this.deletedImageIds, newMainImageId);
        } else {
            this.editProduct(files, this.deletedImageIds, newMainImageId);
        }

        this.clear();
    }

    private async createProduct(images: File[], deletedImagesId?: number[], newMainImageId?: number) {
        this.editedProduct.categoryId = this.category.id;

        runInAction(() => this.status = ProductEditorStatus.SAVING);
        try {
            const newProduct = await productsService.addProducts(this.editedProduct);
            newProduct.images = await productsService.editProductImages(newProduct.id, images, deletedImagesId, newMainImageId);

            runInAction(() => {
                this.products.push(newProduct);
                this.status = ProductEditorStatus.SUCCESS;
            });
        } catch (e) {
            runInAction(() => this.status = ProductEditorStatus.FAILURE_SAVING);
        }

    }

    public async editProduct(images: File[], deletedImagesId?: number[], newMainImageId?: number) {
        this.editedProduct.categoryId = this.category.id;

        runInAction(() => this.status = ProductEditorStatus.SAVING);
        try {
            const updatedProduct = await productsService.editProduct(this.editedProduct.id, this.editedProduct);
            updatedProduct.images = await productsService.editProductImages(updatedProduct.id, images, deletedImagesId, newMainImageId);

            runInAction(() => {
                this.products = this.products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
                this.status = ProductEditorStatus.SUCCESS;
            });
        } catch (e) {
            runInAction(() => this.status = ProductEditorStatus.FAILURE_SAVING);
        }
    }

    async onProductDeleted() {
        runInAction(() => this.status = ProductEditorStatus.LOADING);

        try {
            await productsService.deleteProduct(this.editedProduct.id);

            runInAction(() => {
                this.clear();

                this.products = this.products.filter(p => p.id !== this.editedProduct.id);
                this.status = ProductEditorStatus.SUCCESS;
            });
        } catch (e) {
            runInAction(() => this.status = ProductEditorStatus.FAILURE);
        }
    }

    clear() {
        this.editedProduct = this.createEmptyTemplate();
        this.deletedImageIds = [];
        this.uploadedImages = [];
    }

    onTitleChanged(title: string) {
        this.editedProduct.title = title;
    }

    onBrandChanged(brand: string) {
        this.editedProduct.brand = brand;
    }

    onDescriptionChanged(description: string) {
        this.editedProduct.description = description;
    }

    onUrlChange(url: string) {
        this.editedProduct.url = url;
    }

    onPriceChanged(price: number) {
        this.editedProduct.price = price;
        this.editedProduct.discountPercent = Math.floor((1 - this.editedProduct.price / this.editedProduct.oldPrice) * 100);
    }

    onOldPriceChanged(oldPrice: number) {
        this.editedProduct.oldPrice = oldPrice;
        this.editedProduct.discountPercent = Math.floor((1 - this.editedProduct.price / this.editedProduct.oldPrice) * 100);
    }

    onIsNewToggled() {
        this.editedProduct.isNew = !this.editedProduct.isNew;
    }

    onIsBestsellerChange(isBestseller: boolean) {
        this.editedProduct.isBestseller = isBestseller;
    }

    onAmountChanged(amount: number) {
        this.editedProduct.count = amount;

    }

    onMaxByOrderChange(maxByOrder: number) {
        this.editedProduct.maxByOrder = maxByOrder;
    }

    onAvailabilityChange(availability: AvailableStatus) {
        this.editedProduct.availability = availability;
    }

    onDiscountPercentChange(discountPercent: number) {
        this.editedProduct.discountPercent = discountPercent;
    }

    uploadImages(images: FileList) {
        const nanoid = customAlphabet('1234567890', 18);
        const newUploadedImages: IUploadedFile[] = [];
        const newProductImages: IImage[] = [];

        for (const image of images) {
            const id = +nanoid();

            newUploadedImages.push({
                id: id,
                file: image
            });

            newProductImages.push({
                id: id,
                url: URL.createObjectURL(image),
                isMain: false
            });
        }

        runInAction(() => {
            this.uploadedImages = [...this.uploadedImages, ...newUploadedImages];
            this.editedProduct.images = [...this.editedProduct.images, ...newProductImages];
        });
    }

    selectMainImage(imageId: number) {
        const updatedImages = this.editedProduct.images.map((img) => {
            return {
                ...img,
                isMain: img.id === imageId
            }
        });

        const uploadedImageIndex = this.uploadedImages.findIndex(uf => uf.id == imageId);
        if (uploadedImageIndex !== -1) {
            const temp = this.uploadedImages[0];
            this.uploadedImages[0] = this.uploadedImages[uploadedImageIndex];
            this.uploadedImages[uploadedImageIndex] = temp;
        }

        runInAction(() => {
            this.editedProduct.images = updatedImages
            this.uploadedImages = [...this.uploadedImages];
        });
    }

    deleteImage(image: IImage) {
        let indexToDelete = this.editedProduct.images.findIndex(img => img == image);
        this.editedProduct.images.splice(indexToDelete, 1);

        indexToDelete = this.uploadedImages.findIndex(file => file.id == image.id);
        if (indexToDelete != -1) {
            this.uploadedImages.splice(indexToDelete, 1);
        }

        if (!REGEX.BLOB.test(image.url)) {
            this.deletedImageIds.push(image.id);
        }
    }

    private createEmptyTemplate(): IProduct {
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
            attributes: [],
            images: []
        }
    }
}

export default new ProductEditorStore();