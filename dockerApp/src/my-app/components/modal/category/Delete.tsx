import React, { useState } from "react";
import {
	makeStyles,
	Theme,
	createStyles,
	useTheme,
	IconButton,
	Container,
	Button,
} from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import Select from "react-select";
import { useRouter } from "next/router";
import Modal from "react-modal";

import { deleteCategory, ItemsInCategory } from "lib/editItems";
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

type OptionData = {
	value: string;
	label: string;
}[];

type Props = {
	items: ItemsInCategory[];
	lab: string;
	options: OptionData;
	onCloseClick: () => void;
};

const Category: React.FunctionComponent<Props> = ({ items, lab, options, onCloseClick }) => {
	const classes = useStyles(useTheme());
	const router = useRouter();

	//モーダルの設定
	Modal.setAppElement("#__next");
	const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  	const [error, setError] = useState("");

	//カテゴリの情報
	const [deleteCategoryName, setDeleteCategoryName] = useState("");

	//選択したカテゴリ情報を取り出す関数
	const getSelectedData = (selectedOption) => {
		setDeleteCategoryName(items[parseInt(selectedOption.value)].category);
	};

	//カテゴリを削除する関数
	const handleDeleteCategory = async (category: string) => {
		if ( category === "" ) {
			setError("削除するカテゴリを選択してください");
			setErrorModalIsOpen(true);
			return;
		}
		await deleteCategory(lab, category)
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
				<Select
					placeholder="削除するカテゴリを選択"
					options={options}
					onChange={getSelectedData}
					className={classes.select}
				/>
				<div className={classes.buttonContainer}>
					<Button
						color="secondary"
						variant="contained"
						onClick={() => handleDeleteCategory(deleteCategoryName)}
					>
						削除
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