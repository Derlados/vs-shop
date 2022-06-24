import React, { ChangeEvent, FC, MutableRefObject } from 'react'
import './file-uploader.scss';

interface FileUploaderProps {
    inputRef?: MutableRefObject<any>;
    className: string;
    children?: JSX.Element;
    multiple?: boolean;
    onUploadImage: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FileUploader: FC<FileUploaderProps> = ({ inputRef, className, children, multiple = false, onUploadImage }) => {
    return (
        <div className='file-uploader'>
            <label className={className} htmlFor="file-upload" >
                {children}
            </label>
            <input ref={inputRef} className='file-uploader__input' id="file-upload" type="file" name="myImage" onChange={onUploadImage} multiple={multiple} />
        </div>
    )
}

export default FileUploader