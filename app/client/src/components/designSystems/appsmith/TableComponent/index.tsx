import React, { useEffect, useMemo } from "react";
import Table from "components/designSystems/appsmith/TableComponent/Table";
import {
  ColumnTypes,
  CompactMode,
  ReactTableColumnProps,
  ReactTableFilter,
} from "components/designSystems/appsmith/TableComponent/Constants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";

export interface ColumnMenuOptionProps {
  content: string | JSX.Element;
  closeOnClick?: boolean;
  isSelected?: boolean;
  editColumnName?: boolean;
  columnAccessor?: string;
  id?: string;
  category?: boolean;
  options?: ColumnMenuSubOptionProps[];
  onClick?: (columnIndex: number, isSelected: boolean) => void;
}

export interface ColumnMenuSubOptionProps {
  content: string | JSX.Element;
  isSelected?: boolean;
  closeOnClick?: boolean;
  onClick?: (columnIndex: number) => void;
  id?: string;
  category?: boolean;
  isHeader?: boolean;
}

interface ReactTableComponentProps {
  widgetId: string;
  widgetName: string;
  searchKey: string;
  isDisabled?: boolean;
  isVisible?: boolean;
  isLoading: boolean;
  editMode: boolean;
  width: number;
  height: number;
  pageSize: number;
  tableData: Array<Record<string, unknown>>;
  disableDrag: (disable: boolean) => void;
  onRowClick: (rowData: Record<string, unknown>, rowIndex: number) => void;
  onCommandClick: (dynamicTrigger: string, onComplete: () => void) => void;
  updatePageNo: (pageNo: number, event?: EventType) => void;
  sortTableColumn: (column: string, asc: boolean) => void;
  nextPageClick: () => void;
  prevPageClick: () => void;
  pageNo: number;
  serverSidePaginationEnabled: boolean;
  selectedRowIndex: number;
  selectedRowIndices: number[];
  multiRowSelection?: boolean;
  hiddenColumns?: string[];
  triggerRowSelection: boolean;
  columnSizeMap?: { [key: string]: number };
  handleResizeColumn: (columnSizeMap: { [key: string]: number }) => void;
  handleReorderColumn: (columnOrder: string[]) => void;
  searchTableData: (searchKey: any) => void;
  filters?: ReactTableFilter[];
  applyFilter: (filters: ReactTableFilter[]) => void;
  columns: ReactTableColumnProps[];
  compactMode?: CompactMode;
  updateCompactMode: (compactMode: CompactMode) => void;
  isVisibleSearch?: boolean;
  isVisibleFilters?: boolean;
  isVisibleDownload?: boolean;
  isVisibleCompactMode?: boolean;
  isVisiblePagination?: boolean;
}

function ReactTableComponent(props: ReactTableComponentProps) {
  const { columnOrder, hiddenColumns } = useMemo(() => {
    const order: string[] = [];
    const hidden: string[] = [];
    props.columns.forEach((item) => {
      if (item.isHidden) {
        hidden.push(item.accessor);
      } else {
        order.push(item.accessor);
      }
    });
    return { columnOrder: order, hiddenColumns: hidden };
  }, [props.columns]);

  useEffect(() => {
    let dragged = -1;
    const headers = Array.prototype.slice.call(
      document.querySelectorAll(`#table${props.widgetId} .draggable-header`),
    );
    headers.forEach((header, i) => {
      header.setAttribute("draggable", true);

      header.ondragstart = (e: React.DragEvent<HTMLDivElement>) => {
        header.style =
          "background: #efefef; border-radius: 4px; z-index: 100; width: 100%; text-overflow: none; overflow: none;";
        e.stopPropagation();
        dragged = i;
      };

      header.ondrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
      };

      header.ondragend = (e: React.DragEvent<HTMLDivElement>) => {
        header.style = "";
        e.stopPropagation();
        setTimeout(() => (dragged = -1), 1000);
      };

      // the dropped header
      header.ondragover = (e: React.DragEvent<HTMLDivElement>) => {
        if (i !== dragged && dragged !== -1) {
          if (dragged > i) {
            header.parentElement.className = "th header-reorder highlight-left";
          } else if (dragged < i) {
            header.parentElement.className =
              "th header-reorder highlight-right";
          }
        }
        e.preventDefault();
      };

      header.ondragenter = (e: React.DragEvent<HTMLDivElement>) => {
        if (i !== dragged && dragged !== -1) {
          if (dragged > i) {
            header.parentElement.className = "th header-reorder highlight-left";
          } else if (dragged < i) {
            header.parentElement.className =
              "th header-reorder highlight-right";
          }
        }
        e.preventDefault();
      };

      header.ondragleave = (e: React.DragEvent<HTMLDivElement>) => {
        header.parentElement.className = "th header-reorder";
        e.preventDefault();
      };

      header.ondrop = (e: React.DragEvent<HTMLDivElement>) => {
        header.style = "";
        header.parentElement.className = "th header-reorder";
        if (i !== dragged && dragged !== -1) {
          e.preventDefault();
          const newColumnOrder = [...columnOrder];
          // The dragged column
          const movedColumnName = newColumnOrder.splice(dragged, 1);

          // If the dragged column exists
          if (movedColumnName && movedColumnName.length === 1) {
            newColumnOrder.splice(i, 0, movedColumnName[0]);
          }
          props.handleReorderColumn([...newColumnOrder, ...hiddenColumns]);
        } else {
          dragged = -1;
        }
      };
    });
  });

  const sortTableColumn = (columnIndex: number, asc: boolean) => {
    if (columnIndex === -1) {
      props.sortTableColumn("", asc);
    } else {
      const column = props.columns[columnIndex];
      const columnType = column.metaProperties?.type || ColumnTypes.TEXT;
      if (
        columnType !== ColumnTypes.IMAGE &&
        columnType !== ColumnTypes.VIDEO
      ) {
        props.sortTableColumn(column.accessor, asc);
      }
    }
  };

  const selectTableRow = (row: {
    original: Record<string, unknown>;
    index: number;
  }) => {
    props.onRowClick(row.original, row.index);
  };

  return (
    <Table
      applyFilter={props.applyFilter}
      columnSizeMap={props.columnSizeMap}
      columns={props.columns}
      compactMode={props.compactMode}
      data={props.tableData}
      disableDrag={() => {
        props.disableDrag(true);
      }}
      editMode={props.editMode}
      enableDrag={() => {
        props.disableDrag(false);
      }}
      filters={props.filters}
      handleResizeColumn={props.handleResizeColumn}
      height={props.height}
      isLoading={props.isLoading}
      isVisibleCompactMode={props.isVisibleCompactMode}
      isVisibleDownload={props.isVisibleDownload}
      isVisibleFilters={props.isVisibleFilters}
      isVisiblePagination={props.isVisiblePagination}
      isVisibleSearch={props.isVisibleSearch}
      nextPageClick={() => {
        props.nextPageClick();
      }}
      pageNo={props.pageNo - 1}
      pageSize={props.pageSize || 1}
      prevPageClick={() => {
        props.prevPageClick();
      }}
      searchKey={props.searchKey}
      searchTableData={props.searchTableData}
      selectTableRow={selectTableRow}
      selectedRowIndex={props.selectedRowIndex}
      selectedRowIndices={props.selectedRowIndices}
      serverSidePaginationEnabled={props.serverSidePaginationEnabled}
      sortTableColumn={sortTableColumn}
      triggerRowSelection={props.triggerRowSelection}
      updateCompactMode={props.updateCompactMode}
      updatePageNo={props.updatePageNo}
      widgetId={props.widgetId}
      widgetName={props.widgetName}
      width={props.width}
    />
  );
}

export default ReactTableComponent;
