import { NextPage } from "next";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import {
  Button,
  Container,
  makeStyles,
  Theme,
  createStyles,
  useTheme,
  CircularProgress,
} from "@material-ui/core";

import { useLab } from "lib/labAuth";
import { useUser, getUsers, memberDataSet, UserData } from "lib/userAuth";
import Table from "components/atoms/Table";
import Auth from "components/modal/Auth";
import Balance from "components/modal/Balance";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      flexDirection: "row",
      marginTop: theme.spacing(2),
    },
    button: {
      marginLeft: theme.spacing(2),
    },
    tableContainer: {
      marginTop: theme.spacing(2),
    },
    close: {
      display: "flex",
      justifyContent: "flex-end",
    },
	})
);

//Modalの大きさと位置の指定
const balanceModalStyles = {
	content: {
		width: "450px",
		height: "350px",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
};

//Modalの大きさと位置の指定
const authModalStyles = {
	content: {
		width: "400px",
		height: "300px",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
};

const Admin: NextPage = () => {
  const lab = useLab();
  const user = useUser();
  //ユーザ情報の取得
  const { isLoading, users } = getUsers(lab);
  const router = useRouter();

  const classes = useStyles(useTheme());

  //モーダルの設定
  Modal.setAppElement("#__next");
	const [balanceModalIsOpen, setBalanceModalIsOpen] = useState(false);
  const [authModalIsOpen, setAuthModalIsOpen] = useState(false);

  //ボタンクリックアクション
  const onBalanceClick = () => setBalanceModalIsOpen(true);
  const onAuthClick = () => setAuthModalIsOpen(true);
  const onPurchaseClick = () => router.push("admin/edit-items");

  //メンバー一覧のカラム
  const memberColumns = useMemo(
		() => [
			{
				Header: "ユーザ名",
				accessor: "username",
			},
			{
				Header: "残高",
				accessor: "balance",
			},
      {
        Header: "コーヒー残高",
        accessor: "coffeeBalance",
      },
      {
        Header: "権限",
        accessor: "auth"
      }
		],
		[]
	);

  //メンバーデータ
  const memberData = useMemo(
    () => {
      return users.map((u) => memberDataSet(u));
    },
    [isLoading, users]
  );

  //BalanceModalで選択できるユーザー一覧
	const balanceOptions = useMemo(() => {
		return users.map(user => ({
			value: user.userID,
			label: user.displayName
		}));
	}, [users]);

  //AuthModalで選択できるユーザー一覧
	const authOptions = useMemo(() => {
		return users.map(user => ({
			value: user.userID,
			label: user.displayName
		})).filter((u) => u.value !== user.uid);
	}, [users]);

  return (
    <>
      <Container className={classes.buttonContainer}>
        <Button
          color="secondary"
          variant="contained"
          onClick={onBalanceClick}
          className={classes.button}
        >
          残高変更
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={onAuthClick}
          className={classes.button}
        >
          権限変更
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={onPurchaseClick}
          className={classes.button}
        >
          商品登録・編集
        </Button>
      </Container>
      <Container className={classes.tableContainer}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Table caption={`${lab}メンバー`} columns={memberColumns} data={memberData} />
        )}
      </Container>
      <Modal
        isOpen={balanceModalIsOpen}
        style={balanceModalStyles}
      >
        <Balance
          users={users}
          lab={lab}
          options={balanceOptions}
          onCloseClick={() => setBalanceModalIsOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={authModalIsOpen}
        style={authModalStyles}
      >
        <Auth
          users={users}
          lab={lab}
          options={authOptions}
          onCloseClick={() => setAuthModalIsOpen(false)}
        />
      </Modal>
    </>
  );
};
export default Admin;
