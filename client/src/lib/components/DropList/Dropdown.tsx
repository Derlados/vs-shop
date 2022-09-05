import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { FC, useEffect, useRef, useState } from 'react'

interface DropdownProps {
    className: string;
    children: JSX.Element;
    isOpen: boolean;
}

interface LocalStore {
    currentHeight: number | string;
    maxHeight: number;
}

const Dropdown: FC<DropdownProps> = observer(({ className, children, isOpen }) => {
    const ref = useRef<HTMLDivElement>(null);
    const localStore = useLocalObservable<LocalStore>(() => ({
        currentHeight: 'max-content',
        maxHeight: -1
    }))

    useEffect(() => {
        localStore.maxHeight = ref.current?.clientHeight ?? 0
        localStore.currentHeight = 0;
    }, [])

    useEffect(() => {
        console.log(isOpen, localStore.currentHeight);
        localStore.currentHeight = isOpen ? localStore.maxHeight : 0;
    }, [isOpen])
    console.log(isOpen, localStore.currentHeight);

    return (
        <div ref={ref} className={className} style={{
            height: localStore.currentHeight
        }}>
            {children}
        </div>
    )
});

export default Dropdown