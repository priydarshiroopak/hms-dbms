import { React, useMemo, useState } from "react";
import { useAsyncDebounce } from "react-table";
import { Label, Input, Row, Col } from "reactstrap";

// Component for Global Filter
export function GlobalFilter({ globalFilter, setGlobalFilter, TableName }) {
  const [value, setValue] = useState(globalFilter);

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Row className="align-items-center">
      <Col sm={3}> 
        <Label for="GlobalFilter"> Search {TableName || ""}: </Label>
      </Col>
      <Col sm={6}>
        <Input
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="Global filter... "
          id="GlobalFilter"
          style={{
            fontSize: "1.1rem",
            // margin: "15px",
            display: "inline",
          }}
        />
      </Col>
    </Row>
  );
}

// Component for Default Column Filter
export function DefaultFilterForColumn({
  column: {
    filterValue,
    preFilteredRows: { length },
    setFilter,
  },
}) {
  return (
    <Input 
      value={filterValue || ""}
      onChange={(e) => {
        // Set undefined to remove the filter entirely
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${length} records...`}
      style={{ margin: "0.5rem 0", maxWidth: "13rem" }}
    />
  );
}

// Component for Custom Select Filter
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Use preFilteredRows to calculate the options
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // UI for Multi-Select box
  return (
    <Input
      type="select"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Input>
  );
}
