import React from "react";
import ReactPaginate from "react-paginate";
import {
	Theme,
	useTheme,
	makeStyles,
	createStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		pagination: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
			listStyleType: "none",
			marginTop: theme.spacing(2),
		},
		item: {
			display: "inline-flex",
			alignItems: "center",
			borderRadius: "20px",
			justifyContent: "center",
			fontSize: "12px",
			height: "30px",
			width: "30px",
			"&:hover": {
				backgroundColor: "#99F2FF",
				cursor: "pointer",
			}
		},
		tipItem: {
			display: "inline-flex",
			alignItems: "center",
			borderWidth: "thin",
			justifyContent: "center",
			fontSize: "12px",
			height: "30px",
			width: "30px",
			cursor: "pointer",
		},
		active: {
			display: "inline-flex",
			alignItems: "center",
			fontSize: "12px",
			height: "30px",
			width: "30px",
			color: "black",
			backgroundColor: "#99F2FF",
		}
	})
);

type Props = {
	pageCount: number;
	onPageChange: (selectedPage) => void;
};

const Pagination: React.FunctionComponent<Props> = ({ pageCount, onPageChange }) => {
	const classes = useStyles(useTheme());
	return (
		<ReactPaginate
			previousLabel={"<"}
			previousClassName={classes.tipItem}
			previousLinkClassName={classes.tipItem}
			nextLabel={">"}
			nextClassName={classes.tipItem}
			nextLinkClassName={classes.tipItem}
			breakLabel={"..."}
			breakClassName={classes.item}
			breakLinkClassName={classes.item}
			pageCount={pageCount}
			marginPagesDisplayed={2}
			pageRangeDisplayed={4}
			onPageChange={onPageChange}
			containerClassName={classes.pagination}
			pageClassName={classes.item}
			pageLinkClassName={classes.item}
			activeClassName={classes.active}
			disabledClassName={"disabled-button d-none"}
		/>
	)
};

export default Pagination;