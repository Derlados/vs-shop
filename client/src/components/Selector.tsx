import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC } from 'react'
import '../styles/components/selector.scss';

interface SelectorProps {
    className?: string;
    hint: string;
    values: string[];
    onChange: (value: string) => void;
}

interface LocalStore {
    selectedValue: string;
    isOpen: boolean;
}

const Selector: FC<SelectorProps> = observer(({ className, hint, values, onChange }) => {
    const localStore = useLocalObservable<LocalStore>(() => ({
        selectedValue: "Не вибрано",
        isOpen: false
    }));

    const select = (value: string) => {
        localStore.isOpen = false;
        localStore.selectedValue = value;
        onChange(value);
    }

    const toggleSelector = () => {
        localStore.isOpen = !localStore.isOpen;
    }

    return (
        <div className={`${className} selector`}>
            <div className='selector__hint'>{hint}</div>
            <div className='selector__container'>
                <div className={classNames('selector__selected-value', {
                    'selector__selected-value_open': localStore.isOpen
                })} onClick={toggleSelector}>{localStore.selectedValue}</div>
                <ul className={classNames('selector__values', {
                    'selector__values_open': localStore.isOpen
                })}>
                    {values.map(value => (
                        <li className={classNames('selector__value ', {
                            'selector__value_selected': value == localStore.selectedValue
                        })} onClick={() => select(value)}>{value}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
})

export default Selector