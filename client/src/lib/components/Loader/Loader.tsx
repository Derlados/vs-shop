import { FC } from 'react';
import './loader.scss';

enum Colors {
    light = 'light',
    dark = 'dark',
    white = 'white'
}

interface LoaderProps {
    color?: keyof typeof Colors;
}

const Loader: FC<LoaderProps> = ({ color }) => {
    return (
        <div className={`lds-dual-ring lds-dual-ring_${color ?? 'dark'}`}></div>
    )
}

export default Loader