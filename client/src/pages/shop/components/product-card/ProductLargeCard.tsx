import { observer } from 'mobx-react-lite';
import React, { FC } from 'react'
import { ProductCardProps } from './ProductCard'

const ProductLargeCard: FC<ProductCardProps> = observer(({ product, addToCart, addToFavorite, openFullView, onOpenQuickView }) => {
    return (
        <div>ProductLargeCard</div>
    )
});

export default ProductLargeCard