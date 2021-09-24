import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Nav, NavProps } from 'components/CardNav'
import { ButtonMenuItem } from 'maki-toolkit'

type TableNavProps = NavProps
const TableNav: FC<TableNavProps> = ({ activeIndex }) => {
  return (
    <Nav activeIndex={activeIndex}>
      <ButtonMenuItem id="table-my-orders-link" to="/limit?table=my-orders" as={Link}>
        My Orders
      </ButtonMenuItem>
      <ButtonMenuItem id="table-my-orders-link" to="/limit?table=completed-orders" as={Link}>
        Completed Orders
      </ButtonMenuItem>
      <ButtonMenuItem id="table-closed-orders-link" to="/limit?table=closed-orders" as={Link}>
        Closed Orders
      </ButtonMenuItem>
    </Nav>
  )
}

export default TableNav
