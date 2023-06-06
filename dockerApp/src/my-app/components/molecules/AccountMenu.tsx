import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { useRecoilState } from "recoil";

import { useUser, userLogout, getDisplayName } from "lib/userAuth";
import { labLogout, labState } from "lib/labAuth";
import AppBarMenuItem from "components/atoms/AppBarMenuItem";
import Error from "components/modal/Error";


//Modalの大きさと位置の指定
const customStyles = {
	content: {
		width: "500px",
		height: "500px",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
};

const AccountMenu: React.FunctionComponent = () => {
	//モーダル
	Modal.setAppElement("#__next");
	const [error, setError] = useState("");
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const router = useRouter();
	const user = useUser();
	const [lab, setLab] = useRecoilState(labState);
	const { isLoading, username } = getDisplayName(user, lab);


	//ユーザログアウト
	const handleLogout = (): void => {
		userLogout().catch((error) => {
			setError(error.message);
			setModalIsOpen(true);
		});
	};

	const item = useMemo(
		() => [
			{
				label: user !== null ? username : undefined,
				onClick: lab !== null ? (() => router.push("/mypage")) : undefined
			},
			{
				label: lab !== null ? lab : undefined
			},
			{
				label: "Settings",
				onClick: router.pathname !== "/login" ? (() => router.push("/mypage/settings")) : undefined
			},
			{
				label: "Logout",
				onClick: router.pathname !== "/login" ? handleLogout : undefined
			}
		], [username, lab, router]
	);


	return(
		<>
			<AppBarMenuItem items={item} />
			<Modal
				isOpen={modalIsOpen}
				style={customStyles}
			>
				<Error
				error={error}
				onCloseClick = {() => {
								setModalIsOpen(false);
							}}
				/>
			</Modal>
		</>
	)
};

export default AccountMenu;