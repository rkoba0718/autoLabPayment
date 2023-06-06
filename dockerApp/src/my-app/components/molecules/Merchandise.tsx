import React, { useState } from "react";
import Image from "next/image";
import { Typography, makeStyles, Button } from "@material-ui/core";
import { User } from "firebase/auth";
import Modal from "react-modal";

import { Item } from "lib/editItems";
import Purchase from "components/modal/Purchase";

type Props = {
	lab: string;
	user: User;
	category: string;
	item: Item;
	isLessThan6: boolean;
	isAdmin: boolean;
};

const useStyles = makeStyles({
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		margin: "10px 15px",
		width: "150px",
		height: "150px",
		borderRadius: "20px",
		border: "solid",
		minWidth: "150px"
	},
	lessThan6: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		marginTop: "10px",
		marginBottom: "10px",
		marginLeft: "15px",
		marginRight: "43px",
		width: "150px",
		height: "150px",
		borderRadius: "20px",
		border: "solid",
		minWidth: "150px"
	},
	close: {
		height: 0,
		textAlign: "right",
	},
	item: {
		maxWidth: "100%",
		overflow: "hidden",
		textOverflow: "ellipsis",
	}
});

//Modalの大きさと位置の指定
const customStyles = {
	content: {
		width: "400px",
		height: "500px",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
};

const Merchandise: React.FunctionComponent<Props> = ({ lab, user, category, item, isLessThan6, isAdmin }) => {
	const classes = useStyles();

	Modal.setAppElement("#__next");
	const [modalIsOpen, setModalIsOpen] = useState(false);

	return (
		<>
			<div
				className={isLessThan6 ? classes.lessThan6 : classes.container}
				onClick={() => {
					setModalIsOpen(true);
				}}
			>
				<Typography noWrap variant="h6" className={classes.item}>{item.name}</Typography>
				<Image src={item.imageURL} width={100} height={100} />
			</div>
			<Modal
				isOpen={modalIsOpen}
				style={customStyles}
			>
				<Purchase
					lab={lab}
					user={user}
					category={category}
					item={item}
					isAdmin={isAdmin}
					onCloseClick = {() => {
						setModalIsOpen(false);
					}}
				/>
			</Modal>
		</>
	);
};

export default Merchandise;