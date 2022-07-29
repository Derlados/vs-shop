import React, { ChangeEvent, FC, MutableRefObject, useEffect, useState } from 'react'
import './file-uploader.scss';
import { nanoid } from 'nanoid';

interface FileUploaderProps {
    inputRef?: MutableRefObject<any>;
    className: string;
    children?: JSX.Element;
    multiple?: boolean;
    onUploadImage: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FileUploader: FC<FileUploaderProps> = ({ inputRef, className, children, multiple = false, onUploadImage }) => {
    const [uniqueId] = useState<string>(nanoid())

    return (
        <div className='file-uploader'>
            <label className={className} htmlFor={uniqueId}>
                {children}
            </label>
            <input ref={inputRef} className='file-uploader__input' id={uniqueId} type="file" name="myImage" onChange={onUploadImage} multiple={multiple} />
        </div>
    )
}

export default FileUploader