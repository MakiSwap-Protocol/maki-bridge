import React from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'
import { Text } from 'maki-toolkit'
import { convertHexToRGB } from 'utils'

const Styles = styled.div`
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  table {
    margin: 0;
    padding: 0;
    thead {
      border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
      border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
      color: ${({ theme }) => theme.colors.text};
    }
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    td {
      margin: 0;
      padding: 0.8rem;
    }

    th {
      margin: 0;
      padding: 0.8rem;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
    }
  }
`

const TextCenter = styled(Text)`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[4]}px;
  color: ${({ theme }) => theme.colors.textDisabled};
  font-weight: bold;
`

interface Column {
  readonly Header: string
  readonly accessor: string
  Cell?: (args: any) => JSX.Element
}

export interface TableData {
  [key: string]: string | number
}

interface TableProps {
  columns: Column[]
  data: TableData[]
  id: string
}

export function Table({ columns, data, id }: TableProps) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    // hooks => {
    //   hooks.allColumns.push( column => [
    //     {
    //       Cell: ({ row }) => (
    //         <div></div>
    //       )
    //     }
    //   ])
    // }
  )

  return (
    <Styles>
      <table {...getTableProps()} id={id}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} align="left">
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {rows.length > 0 && (
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} align="left">
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        )}
      </table>
      {(!data || data.length === 0) && <TextCenter fontSize="14px">No results found.</TextCenter>}
    </Styles>
  )
}
