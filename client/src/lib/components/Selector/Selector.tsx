import classNames from 'classnames';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC, useEffect, useRef } from 'react'
import './selector.scss';

interface SelectorProps {
  className?: string;
  withInput?: boolean;
  withSearch?: boolean;
  selectedId?: string;
  innerHint?: boolean;
  hint: string;
  values: Map<string, string>;
  onSelect: (key: string, value: string) => void;
  onChange?: (value: string) => void;
}

interface LocalStore {
  selectedValue: string;
  isOpen: boolean;
}

const Selector: FC<SelectorProps> = observer(({ className, withInput = false, withSearch = false, innerHint = false, hint, values, selectedId, onSelect, onChange = () => { } }) => {
  const NOT_SELECTED = "Не вибрано";
  const localStore = useLocalObservable<LocalStore>(() => ({
    selectedValue: '',
    isOpen: false
  }));

  useEffect(() => {
    if (selectedId != null) {
      localStore.selectedValue = values.get(selectedId) ?? '';
    }
  }, [selectedId, values])

  const select = (key: string, value: any) => {
    localStore.selectedValue = value;
    localStore.isOpen = false;
    onSelect(key, value);
  }

  const inputOnChange = (value: string) => {
    localStore.selectedValue = value;
    onChange(value);
  }

  const toggleSelector = () => {
    localStore.isOpen = !localStore.isOpen;
  }

  const getValidValues = () => {
    if (!withSearch) {
      return [...values];
    }

    return [...values].filter(([k, v]) => v.toLocaleLowerCase().includes(localStore.selectedValue.toLocaleLowerCase()));
  }

  return (
    <div className={`${className} selector`}>
      {(!innerHint && hint !== '') && <div className='selector__hint'>{hint}</div>}
      <div className={classNames('selector__container', {
        'selector__container_open': localStore.isOpen
      })}>
        {withInput
          ?
          <input className={classNames('selector__selected-value', {
            'selector__selected-value_not-selected': !localStore.selectedValue
          })}
            onFocus={() => localStore.isOpen = true}
            onBlur={() => { setTimeout(() => localStore.isOpen = false, 0) }}
            placeholder={(innerHint && hint !== '') ? hint : NOT_SELECTED}
            value={localStore.selectedValue}
            onChange={(e) => inputOnChange(e.target.value)}
          />
          :
          <div className={classNames('selector__selected-value', {
            'selector__selected-value_not-selected': !localStore.selectedValue
          })} onClick={toggleSelector}>{localStore.selectedValue || `${NOT_SELECTED}${hint !== '' ? ` (${hint})` : ''}`}</div>
        }
        <ul className={classNames('selector__values', {
          'selector__values_open': localStore.isOpen
        })}>
          {getValidValues().map(([key, value]) => (
            <li key={key} className={classNames('selector__value', {
              'selector__value_selected': value === localStore.selectedValue
            })} onMouseDown={() => select(key, value)}>{value}</li>
          ))}
        </ul>
      </div>
    </div >
  )
})

export default Selector