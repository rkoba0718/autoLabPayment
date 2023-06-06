import React, { useState } from "react";
import Image from "next/image";
import { User } from "firebase/auth";
import { Container, Typography, makeStyles, IconButton, Button, CircularProgress } from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from "next/router";

import { purchaseItem, Item, deleteItem } from "lib/editItems";

const useStyles = makeStyles({
	close: {
		display: "flex",
		justifyContent: "flex-end",
	},
	image: {
		display: "flex",
		justifyContent: "center",
		marginBottom: "10px"
	},
	item: {
		marginBottom: "10px"
	},
	button: {
		backgroundColor: "#99F2FF",
		color: "black"
	},
	error: {
		color: "red"
	}
});

type Props = {
	lab: string;
	user: User;
	category: string;
	item: Item;
	isAdmin: boolean;
	onCloseClick: () => void;
};

const Purchase: React.FunctionComponent<Props> = ({ lab, user, category, item, isAdmin , onCloseClick }) => {
	const classes = useStyles();
	const router = useRouter();

	//ModalのStateを管理
	const [processing, setProcessing] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	//商品を購入する関数
	const handlePurchaseItem = async (item: Item) => {
		setProcessing(true);
		await purchaseItem(lab, user, item)
		  .then(() => {
			setSuccess(true);
		  })
		  .catch((error) => {
			setError(error.message);
		  })
		  .finally(() => {
			setProcessing(false);
		  });
	};

	//商品を削除する関数
	const handleDeleteItem = async (category: string, name: string) => {
		await deleteItem(lab, category, name)
		  .then(() => {
				onCloseClick();
				router.reload();
		  })
		  .catch((error) => {
				setError(error.message);
		  });
	};

	return (
		<>
			<div className={classes.close}>
				<IconButton
					onClick={onCloseClick}
				>
					<CloseIcon />
				</IconButton>
			</div>
			<Container>
				{processing ? ( //購入中の表示
					<CircularProgress />
				) : success ? ( //購入成功時の表示
					<>
						<Typography variant="h3">購入成功!!</Typography>
						<Typography variant="h4" className={classes.item}>{item.name}</Typography>
						<div className={classes.image}>
							<Image src={item.imageURL} width={180} height={180} />
						</div>
						<Typography variant="h4" className={classes.item}>¥. {item.price}</Typography>
					</>
				) : error ? ( //購入or削除失敗時の表示
					<>
						<Typography className={classes.error}>{error}</Typography>
						<Typography variant="h4" className={classes.item}>{item.name}</Typography>
						<div className={classes.image}>
							<Image src={item.imageURL} width={180} height={180} />
						</div>
						<Typography variant="h4" className={classes.item}>¥. {item.price}</Typography>
						<Typography variant="h6">説明</Typography>
						{item.description !== undefined
							? <Typography className={classes.item}>{item.description}</Typography>
							: <Typography className={classes.item}>無し</Typography>
						}
						<div className={classes.close}>
							{isAdmin ? (
								<Button
									color="secondary"
									variant="contained"
									onClick={() => {handleDeleteItem(category, item.name)}}
								>
									再削除
								</Button>
							) : (
								<Button
									color="secondary"
									variant="contained"
									onClick={() => {
										const targetItem: Item = {
											category: category,
											name: item.name,
											price: item.price,
											description: item.description !== undefined ? item.description : "無し",
											isCoffee: item.isCoffee,
										};
										handlePurchaseItem(targetItem);
									}}
								>
									再購入
								</Button>
							)}
						</div>
					</>
				) : ( //初期表示
					<>
						<Typography variant="h4" className={classes.item}>{item.name}</Typography>
						<div className={classes.image}>
							<Image src={item.imageURL} width={180} height={180} />
						</div>
						<Typography variant="h4" className={classes.item}>¥. {item.price}</Typography>
						<Typography variant="h6">説明</Typography>
						{item.description !== undefined
							? <Typography className={classes.item}>{item.description}</Typography>
							: <Typography className={classes.item}>無し</Typography>
						}
						<div className={classes.close}>
							{isAdmin ? (
								<Button
									color="secondary"
									variant="contained"
									onClick={() => {handleDeleteItem(category, item.name)}}
								>
									削除
								</Button>
							) : (
								<Button
									color="secondary"
									variant="contained"
									onClick={() => {
										const targetItem: Item = {
											category: category,
											name: item.name,
											price: item.price,
											description: item.description !== undefined ? item.description : "無し",
											isCoffee: item.isCoffee,
										};
										handlePurchaseItem(targetItem);
									}}
								>
									購入
								</Button>
							)}
						</div>
					</>
				)}
			</Container>
		</>
	);
};

export default Purchase;