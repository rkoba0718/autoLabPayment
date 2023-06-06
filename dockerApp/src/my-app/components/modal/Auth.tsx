import React, { useState } from "react";
import {
	makeStyles,
	Theme,
	createStyles,
	useTheme,
	IconButton,
	Typography,
	Container,
	Button
} from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import Select from "react-select";
import { useRouter } from "next/router";
import Modal from "react-modal";

import { UserData } from "lib/userAuth";
import { changeAuth } from "lib/editUserInfo";
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
		item: {
			marginBottom: theme.spacing(2)
		},
		button: {
			display: "flex",
			justifyContent: "flex-end",
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
}

const Auth: React.FunctionComponent<Props> = ({ users, lab, options, onCloseClick }) => {
	const classes = useStyles(useTheme());
	const router = useRouter();

	//モーダルの設定
	Modal.setAppElement("#__next");
	const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  	const [error, setError] = useState("");

	//権限を変更するユーザーの情報
	const [changeAuthUser, setChangeAuthUser] = useState(undefined);

	//選択したユーザー情報を取り出す関数
	const getSelectedData = (selectedOption) => {
		const user = users.filter((u) => u.userID === selectedOption.value);
		setChangeAuthUser(user[0]);
	};

	//権限を変更する関数
  	const handleChangeAuth = async () => {
		if( changeAuthUser === undefined ) {
			setError("ユーザーを選択してください");
			setErrorModalIsOpen(true);
			return;
		}
		await changeAuth(lab, changeAuthUser.userID)
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
					placeholder="権限を変更するユーザーを選択"
					options={options}
					onChange={getSelectedData}
					className={classes.select}
				/>
				<Typography className={classes.item}>
					現在の権限: {changeAuthUser === undefined ? (
						"ユーザーを選択してください"
					) : (
						changeAuthUser.admin ? "Admin": "Guest"
					)}
				</Typography>
				<div className={classes.button}>
					<Button
						color="secondary"
						variant="contained"
						onClick={handleChangeAuth}
					>
						変更
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

export default Auth;