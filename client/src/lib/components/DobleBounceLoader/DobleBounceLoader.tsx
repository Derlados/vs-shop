import { FC } from 'react';
import './double-bounce-spinner.scss'

interface DobleBounceLoaderProps {
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'huge';
  color?: 'default' | 'primary';
}

const DobleBounceLoader: FC<DobleBounceLoaderProps> = ({ size = 'small', color = 'default' }) => {
  return (
    <div className={`spinner spinner_${size} spinner_${color}`}>
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  )
}

export default DobleBounceLoader