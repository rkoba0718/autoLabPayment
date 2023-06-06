import React from "react";
import { makeStyles, IconButton, Typography } from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles({
	close: {
		display: "flex",
		justifyContent: "flex-end",
	},
	text: {
		color: "red",
		textAlign: "center",
	}
});

type Props = {
	error: any;
	onCloseClick: () => void;
};

const Error: React.FunctionComponent<Props> = ({ error, onCloseClick }) => {
	const classes = useStyles();

	return (
		<>
			<div className={classes.close}>
				<IconButton
					onClick={onCloseClick}
				>
					<CloseIcon />
				</IconButton>
			</div>
			<Typography className={classes.text}>{error}</Typography>
		</>
	);
};

export default Error;