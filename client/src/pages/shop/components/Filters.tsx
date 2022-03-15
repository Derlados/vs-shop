import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC } from 'react';
import MultiRangeSlider from '../../../lib/MultiRangeSlider/MultiRangeSlider';
import { IAttribute, ICkeckValue } from '../../../types/types'


interface LocalStore {
    attributes: IAttribute[];
}

const Filters = observer(() => {
    const testData = useLocalObservable<LocalStore>(() => ({
        attributes: [
            {
                name: "ATTRIBUTE 1",
                values: [
                    {
                        value: "value 1",
                        checked: false
                    },
                    {
                        value: "value 2",
                        checked: false
                    },
                    {
                        value: "value 3",
                        checked: true
                    },
                    {
                        value: "value 4",
                        checked: false
                    },
                ]
            },
            {
                name: "ATTRIBUTE 2",
                values: [
                    {
                        value: "value 1",
                        checked: true
                    },
                    {
                        value: "value 2",
                        checked: true
                    }
                ]
            },
            {
                name: "ATTRIBUTE 3",
                values: [
                    {
                        value: "value 1",
                        checked: false
                    },
                    {
                        value: "value 2",
                        checked: false
                    },
                    {
                        value: "value 3",
                        checked: false
                    }
                ]
            }
        ]
    }))

    const onCheckedChange = (attrValue: ICkeckValue) => {
        attrValue.checked = !attrValue.checked;
    }


    return (
        <div className='filters'>
            <div className='filters__title'>Filter By</div>
            <div className='filters__line'></div>
            <div>
                <div className='filters__attr-name'>Price</div>
                <div className='filters__price'>
                    <MultiRangeSlider
                        min={0}
                        max={1000}
                        onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)}
                        onAccept={() => console.log("Not yet implemented")} />
                </div>
                {testData.attributes.map(attr => (
                    <div key={attr.name} className='filters__attr'>
                        <div className='filters__attr-name'>{attr.name}</div>
                        <ul className='filters__attr-list'>
                            {attr.values.map(attrValue => (
                                <li key={attrValue.value} className='filters__attr-item rlc'>
                                    <label className='filters__attr-value rcc'>{attrValue.value}
                                        <input className='filters__checkbox' type="checkbox" checked={attrValue.checked} onChange={() => onCheckedChange(attrValue)} />
                                        <span className='filters__checkmark'></span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
});

export default Filters