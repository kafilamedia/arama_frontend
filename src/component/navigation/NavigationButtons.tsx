
import React, { Component } from 'react';
import { uniqueId } from './../../utils/StringUtil';
interface IProps {
  limit: number,
  totalData: number,
  activePage: number,
  onClick: any
}
const NavigationButtons = (props: IProps) => {
  const btnIndexes = generateButtonValues(props.limit, props.totalData, props.activePage);
  if (btnIndexes.length == 0) {
    return null;
  }
  const lastIndex = btnIndexes[btnIndexes.length - 1];
  const nextPage = props.activePage + 1 >= lastIndex ? 0 : props.activePage + 1;
  const previusPage = props.activePage - 1 < 0 ? lastIndex - 1 : props.activePage - 1;
  return (
    <div>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" onClick={(e) => props.onClick(previusPage)}>Previous</a>
          </li>
          {btnIndexes.map((page, i) => {
            return <li key={`NAV-${uniqueId()}`} className={"page-item " + (page - 1 == props.activePage ? "active" : "")}><a className="page-link " onClick={(e) => props.onClick(page - 1)} >{page}</a></li>
          })}
          <li className="page-item">
            <a className="page-link" onClick={(e) => props.onClick(nextPage)}>Next</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const generateButtonValues = (limit: number, totalData: number, currentPage: number) => {

  /* DISPLAYED BUTTONS */
  const displayed_buttons: number[] = [];
  const buttonCount = Math.ceil(totalData / limit);

  // console.debug("current page:", currentPage);
  const min = (currentPage) - 1;
  const max = (currentPage) + 3;
  // const min = (currentPage) - 2;
  // const max = (currentPage) + 2;

  // console.debug("min", min, "current page:", currentPage, "max", max);
  if (buttonCount > 1) {
    displayed_buttons.push(1);
  }
  for (let i = min; i <= max; i++) {
    if (i > 1 && i <= buttonCount) {
      (displayed_buttons.push(i));
    }
  }
  if (max < buttonCount) {
    displayed_buttons.push(buttonCount);
  }
  return displayed_buttons;
}

export default NavigationButtons;
