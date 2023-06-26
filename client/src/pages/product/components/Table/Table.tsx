import React, { FC } from 'react';
import { IProductAttribute } from '../../../../types/IProductAttribyte';
import './table.scss';

interface TableProps {
  attributes: IProductAttribute[];
}

const Table: FC<TableProps> = ({ attributes }) => {


  return (
    <table className="table">
      {/* Fast hardcode */}
      {attributes.filter(a => a.name != 'Розмір екрану' && a.name != 'Відеокарта').map((attr, index) => (
        <div className="table__row rlc" key={attr.id} style={{ backgroundColor: index % 2 === 1 ? 'white' : '#f9f9f9' }}>
          <div className="table__row-parametr">{attr.name}</div>
          <div className="table__row-value">{attr.value.name}</div>
        </div>
      ))}
    </table>
  );
};

export default Table;