import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC } from 'react'

enum DescCategory {
    DESCRIPTION,
    DETAILS,
    COMMENTS
}

interface LocalStore {
    selectedDesc: DescCategory;
}

/**
 * TODO - Когда контент добавится конкретно 
 * https://template.hasthemes.com/ecolife/ecolife/single-product.html - макет
 */
const ProductDesc: FC = observer(() => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        selectedDesc: DescCategory.DETAILS
    }));

    const setDescCategory = (descCategory: DescCategory) => {
        localStore.selectedDesc = descCategory;
    }

    return (
        <div className='description'>
            <div className='description__buttons rcc'>
                <div className={classNames('description__btn', {
                    'description__btn_selected': localStore.selectedDesc === DescCategory.DESCRIPTION
                })} onClick={() => setDescCategory(DescCategory.DESCRIPTION)}> Description
                </div>
                <div className={classNames('description__btn', {
                    'description__btn_selected': localStore.selectedDesc === DescCategory.DETAILS
                })} onClick={() => setDescCategory(DescCategory.DETAILS)}> Details
                </div>
            </div>
            <div className='description__container'>
                {localStore.selectedDesc === DescCategory.DESCRIPTION &&
                    <div className='description__text'>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor. Ipsum metus feugiat sem, quis fermentum turpis eros eget velit. Donec ac tempus ante. Fusce ultricies massa massa. Fusce aliquam, purus eget sagittis vulputate, sapien libero hendrerit est, sed commodo augue nisi non neque.</p>
                        <p>Cras neque metus, consequat et blandit et, luctus a nunc. Etiam gravida vehicula tellus, in imperdiet ligula euismod eget. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam erat mi, rutrum at sollicitudin rhoncus, ultricies posuere erat. Duis convallis, arcu nec aliquam consequat, purus felis vehicula felis, a dapibus enim lorem nec augue. Nunc facilisis sagittis ullamcorper.</p>
                        <p>Proin lectus ipsum, gravida et mattis vulputate, tristique ut lectus. Sed et lorem nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aenean eleifend laoreet congue. Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt.</p>
                    </div>
                }
                {localStore.selectedDesc === DescCategory.DETAILS &&
                    <div className='description__details rlc'>
                        <ul className='description__list'>
                            <li className='description__list-item description__list-item_attr'>Weight</li>
                            <li className='description__list-item description__list-item_attr'>Dimensions</li>
                            <li className='description__list-item description__list-item_attr'>Materials</li>
                            <li className='description__list-item description__list-item_attr'>Other Info</li>
                        </ul>
                        <ul className='description__list'>
                            <li className='description__list-item description__list-item_val'>400 g</li>
                            <li className='description__list-item description__list-item_val'>10 x 10 x 15 cm</li>
                            <li className='description__list-item description__list-item_val'>60% cotton, 40% polyester</li>
                            <li className='description__list-item description__list-item_val'>American heirloom jean shorts pug seitan letterpress</li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    )
});

export default ProductDesc