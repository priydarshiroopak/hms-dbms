import React, {useEffect, useState} from 'react';

function Table({ data }) {
  // const [datal, setDatal] = useState(data)
  const headers = Object.keys(data[0] || {});

  useEffect(() => {
    // console.log("change encountered!");
  }, [data])

  return (
    <div className="patient_list">
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header, index) => (
                <td key={index}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Table;