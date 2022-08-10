import { FC } from 'react';
import './small-loader.scss'

interface SmallLoaderProps {
    className?: string;
}

const SmallLoader: FC<SmallLoaderProps> = ({ className }) => {
    return (
        <div className={`${className} small-loader`}></div>
    )
}

export default SmallLoader