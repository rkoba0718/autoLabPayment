import React, { useState } from "react";
import {
	makeStyles,
	Theme,
	createStyles,
	useTheme,
	IconButton,
	Container,
	Button,
	TextField
} from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from "next/router";
import Modal from "react-modal";

import { addNewCategory } from "lib/editItems";
import Error from "components/modal/Error";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		close: {
			display: "flex",
			justifyContent: "flex-end",
		},
		select: {
			marginTop: theme.spacing(2),
			marginBottom: theme.spacing(2)
		},
		field: {
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(2),
		},
		buttonContainer: {
			display: "flex",
			justifyContent: "flex-end",
		},
	})
);

//Modalの大きさと位置の指定
const errorModalStyles = {
	content: {
		width: "350px",
		height: "150px",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
};

type Props = {
	lab: string;
	onCloseClick: () => void;
};

const Category: React.FunctionComponent<Props> = ({ lab, onCloseClick }) => {
	const classes = useStyles(useTheme());
	const router = useRouter();

	//モーダルの設定
	Modal.setAppElement("#__next");
	const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  	const [error, setError] = useState("");

	//カテゴリの情報
	const [newCategoryName, setNewCategoryName] = useState("");

	//カテゴリを追加する関数
	const handleAddCategory = async () => {
		if ( newCategoryName === "" ) {
			setError("カテゴリ名を入力してください");
			setErrorModalIsOpen(true);
			return;
		}
		await addNewCategory(lab, newCategoryName)
		.then(() => {
			onCloseClick();
			router.reload();
		})
		.catch((error) => {
			setError(error.message);
			setErrorModalIsOpen(true);
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
				<TextField
					required
					fullWidth
					label="追加するカテゴリ名を入力"
					value={newCategoryName}
					onChange={(e) => setNewCategoryName(e.target.value)}
					className={classes.field}
				/>
				<div className={classes.buttonContainer}>
					<Button
						color="secondary"
						variant="contained"
						onClick={() => handleAddCategory()}
					>
						追加
					</Button>
				</div>
			</Container>
			<Modal
				isOpen={errorModalIsOpen}
				style={errorModalStyles}
			>
				<Error
					error={error}
					onCloseClick={() => setErrorModalIsOpen(false)}
				/>
			</Modal>
		</>
	);
};

export default Category;