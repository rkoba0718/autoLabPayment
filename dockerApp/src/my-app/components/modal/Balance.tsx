import React, { useState } from "react";
import {
	makeStyles,
	Theme,
	createStyles,
	useTheme,
	IconButton,
	Typography,
	Container,
	Button,
	TextField
} from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import Select from "react-select";
import { useRouter } from "next/router";
import Modal from "react-modal";

import { UserData } from "lib/userAuth";
import { reduceBalance } from "lib/editUserInfo";
import Error from "../modal/Error";


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
			marginBottom: theme.spacing(4),
		},
		buttonContainer: {
			display: "flex",
			justifyContent: "flex-end",
		},
		button: {
			marginLeft: theme.spacing(2),
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
	users: UserData[];
	lab: string;
	options: OptionData;
	onCloseClick: () => void;
};

const Balance: React.FunctionComponent<Props> = ({ users, lab, options, onCloseClick }) => {
	const classes = useStyles(useTheme());
	const router = useRouter();

	//モーダルの設定
	Modal.setAppElement("#__next");
	const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  	const [error, setError] = useState("");

	//権限を変更するユーザーの情報
	const [selectedUser, setSelectedUser] = useState(undefined);

	//選択したユーザー情報を取り出す関数
	const getSelectedData = (selectedOption) => {
		const user = users.filter((u) => u.userID === selectedOption.value);
		setSelectedUser(user[0]);
	};

	//減額の情報
	const [amount, setAmount] = useState("");

	//減額処理の関数
	const handleUpdateBalance = async (isCoffee: boolean) => {
		if( selectedUser === undefined ) {
			setError("ユーザーを選択してください");
			setErrorModalIsOpen(true);
			return;
		}
		//10進数Number型に変換
		const amountNum = parseInt(amount, 10);
		//無効値の判定
		if (
		  typeof amountNum !== "number" ||
		  isNaN(amountNum)
		) {
			setError("支払額が不正です");
			setErrorModalIsOpen(true);
			return;
		}
		//金額オーバーの判定
		if (( isCoffee && selectedUser.coffeeBalance < amountNum) ||
			( !isCoffee && selectedUser.balance < amountNum )
		) {
			setError("支払額が残高を超えています");
			setErrorModalIsOpen(true);
			return;
		}

		await reduceBalance(lab, selectedUser.userID, amountNum, isCoffee)
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
					placeholder="残高を変更するユーザーを選択"
					options={options}
					onChange={getSelectedData}
					className={classes.select}
				/>
				<Typography>
					残高: {selectedUser === undefined ? (
						"ユーザーを選択してください"
					) : (
						selectedUser.balance
					)}
				</Typography>
				<Typography>
					コーヒー残高: {selectedUser === undefined ? (
						"ユーザーを選択してください"
					) : (
						selectedUser.coffeeBalance
					)}
				</Typography>
				<TextField
					required
					label="支払額"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					className={classes.field}
				/>
				<div className={classes.buttonContainer}>
					<Button
						color="secondary"
						variant="contained"
						onClick={() => handleUpdateBalance(false)}
						className={classes.button}
					>
						減額
					</Button>
					<Button
						color="secondary"
						variant="contained"
						onClick={() => handleUpdateBalance(true)}
						className={classes.button}
					>
						コーヒー減額
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

export default Balance;