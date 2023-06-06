import React from "react";
import Image from "next/image";
import { useTable } from "react-table";
import { Divider, Typography, makeStyles } from "@material-ui/core";

export type HistoryTableData = {
	date?: string;
	category: string;
	name: string;
	price: number;
	times?: number;
}[];

export type MemberTableData = {
	username: string;
	balance: number;
	coffeeBalance: number;
	auth: string
}[];

type Columns = {
	Header: string;
	accessor: string;
}[];

type Props = {
	caption: string;
	columns: Columns;
	data: HistoryTableData | MemberTableData;
};

const useStyles = makeStyles({
	table: {
		width: "100%",
		textAlign: "center"
	},
	thead: {
		fontSize: "20px",
	},
	tbody: {
		fontSize: "18px",
	},
	th: {
		width: "25%"
	}
});

const Table: React.FunctionComponent<Props> = ({ caption, columns, data }) => {
	//表の情報を取得
	const tableInstance = useTable({ columns, data });
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

	//cssクラス
	const classes = useStyles();

	return (
		<>
			<Typography variant="h6">{caption}</Typography>
			<Divider />
			<table {...getTableProps()} className={classes.table}>
				<thead className={classes.thead}>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th {...column.getHeaderProps()} className={classes.th}>
									{column.render("Header")}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()} className={classes.tbody} >
					{rows.map((row) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map((cell) => (
									<td {...cell.getCellProps()}>{cell.render("Cell")}</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</>
	);
};

export default Table;
