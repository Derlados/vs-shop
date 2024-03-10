import React, { FC } from 'react';
import { IProductAttribute } from '../../../../types/magento/IProductAttribute';
import './table.scss';

interface TableProps {
  attributes: IProductAttribute[];
}

const Table: FC<TableProps> = ({ attributes }) => {

  return (
    <table className="table">
      {attributes.map((attr, index) => (
        <div className="table__row rlc" key={attr.attribute_code} style={{ backgroundColor: index % 2 === 1 ? 'white' : '#f9f9f9' }}>
          <div className="table__row-parametr">{attr.label}</div>
          <div className="table__row-value">{attr.value}</div>
        </div>
      ))}
    </table>
  );
};

export default Table;