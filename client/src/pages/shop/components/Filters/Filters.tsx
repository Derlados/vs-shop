import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import './filters.scss';

interface FiltersProps {
  children: JSX.Element;
  isOpen: boolean;
  onClose: () => void;
}

const Filters: FC<FiltersProps> = observer(({ children, isOpen, onClose }) => {

  return (
    <div className={classNames('filters__mask ', {
      'filters__mask_opened': isOpen
    })}>
      <div className='filters'>
        <div className='filters__close-btn' onClick={onClose}></div>
        {children}
      </div>
    </div>
  )
});

export default Filters