import React, { useState } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import {
	makeStyles,
	Theme,
	createStyles,
	useTheme,
	IconButton,
	Container,
	Button,
	TextField,
	TextareaAutosize,
	FormControlLabel,
	Checkbox,
	Input,
	Typography
} from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import Select from "react-select";

import {
	Item,
	ItemsInCategory,
	addItem,
} from "lib/editItems";
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
		area: {
			marginTop: theme.spacing(3),
			marginBottom: theme.spacing(2),
			width: "100%",
		},
		buttonContainer: {
			display: "flex",
			justifyContent: "flex-end",
			marginTop: theme.spacing(2),
		},
		input: {
			display: "none",
		},
		inputButton: {
			display: "flex",
      		flexDirection: "row",
		},
		item: {
			marginLeft: theme.spacing(2),
			marginTop: theme.spacing(1),
		}
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

const Item: React.FunctionComponent<Props> = ({ items, lab, options, onCloseClick }) => {
	const classes = useStyles(useTheme());
	const router = useRouter();

	//モーダルの設定
	Modal.setAppElement("#__next");
	const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  	const [error, setError] = useState("");

	//商品追加用State
	const [category, setCategory] = useState("");
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [isCoffee, setIsCoffee] = useState(false);
	const [image, setImage] = useState(null as File);

	//選択したカテゴリ情報を取り出す関数
	const getSelectedData = (selectedOption) => {
		setCategory(items[parseInt(selectedOption.value)].category);
	};

	//商品を追加する関数
	const handleAddItem = async () => {
		if ( category === "" ) {
		  setError("カテゴリを選択してください");
		  setErrorModalIsOpen(true);
		  return;
		}

		if ( name == "" ) {
		  setError("商品名を入力してください");
		  setErrorModalIsOpen(true);
		  return;
		}

		if ( price === "" ) {
			setError("値段を入力してください");
			setErrorModalIsOpen(true);
			return;
		}

		//10進数Number型に変換
		const priceNum = parseInt(price, 10);
		if (
		  typeof priceNum !== "number" ||
		  isNaN(priceNum)
		) {
			setError("値段に不正値が入力されています");
			setErrorModalIsOpen(true);
			return;
		}

		const item: Item = {
		  name: name,
		  price: priceNum,
		  description: description,
		  isCoffee: isCoffee,
		  category: category,
		};

		await addItem(lab, category, item, image)
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
					placeholder="カテゴリを選択"
					options={options}
					onChange={getSelectedData}
					className={classes.select}
				/>
				<TextField
					required
					fullWidth
					label="商品名を入力"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className={classes.field}
				/>
				<TextField
					required
					fullWidth
					label="値段を入力"
					value={price}
					onChange={(e) => setPrice(e.target.value)}
					className={classes.field}
				/>
				<TextareaAutosize
					required
					aria-label="説明を入力"
					placeholder="説明を入力"
					minRows={3}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className={classes.area}
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={isCoffee}
							onChange={(e) => setIsCoffee(e.target.checked)}
							color="secondary"
						/>
					}
					label="コーヒー"
				/>
				<div className={classes.field}>
					<Input
						id="image-upload"
						type="file"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.files[0])}
						className={classes.input}
					/>
					<div className={classes.inputButton}>
						<Button
							color="secondary"
							variant="contained"
							component="label"
							htmlFor="image-upload"
						>
							商品画像を選択
						</Button>
						{image === null ? (
							<></>
						) : (
							<Typography className={classes.item}>{image.name}</Typography>
						)}
					</div>
				</div>
				<div className={classes.buttonContainer}>
					<Button
						color="secondary"
						variant="contained"
						onClick={() => handleAddItem()}
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

export default Item;