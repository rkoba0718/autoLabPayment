import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { NextPage } from "next";
import Link from "next/link";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { useUser, userLogin, userLogout, userState } from "../lib/userAuth";
import { Button, makeStyles, Theme, createStyles, useTheme, TextField } from "@material-ui/core";

import { labLogin, labState } from "../lib/labAuth";
import LoginForm from "../components/organisms/LoginForm";
import Error from "../components/modal/Error";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
    field: {
			marginBottom: theme.spacing(2)
		},
		actions: {
			marginTop: theme.spacing(4),
			textAlign: "center",
		},
    link: {
      textAlign: "center",
    }
	})
);

//Modalの大きさと位置の指定
const customStyles = {
	content: {
		width: "500px",
		height: "150px",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
};

const Login: NextPage = () => {
  //モーダル
  Modal.setAppElement("#__next");
  const [error, setError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [labId, setLabId] = useState("");

  const user = useUser();
  const router = useRouter();
  const [, setLab] = useRecoilState(labState);
  //cssクラス
  const classes = useStyles(useTheme());

  //ユーザログイン
  const handleLogin = (): void => {
    userLogin().catch((error) => {
      setError(error.message);
      setModalIsOpen(true);
    });
  };

  //ユーザログアウト
  const handleLogout = (): void => {
    userLogout().catch((error) => {
      setError(error.message);
      setModalIsOpen(true);
    });
  };

  //研究室ログイン
  const handleLabLogin = () => {
    labLogin(labId, user, setLab)
      .then(() => router.push("/mypage"))
      .catch((error) => {
        setError(error.message);
        setModalIsOpen(true);
      });
  };

  return (
    <>
      {user !== null ? (
        <LoginForm pageTitle="" formTitle="研究室ログイン">
          <TextField
            required
            fullWidth
            className={classes.field}
            label="研究室ID"
            value={labId}
            onChange={(e) => setLabId(e.target.value)}
          />
          <Button
            className={classes.field}
            fullWidth
            color="secondary"
            variant="contained"
            onClick={handleLabLogin}
          >
            Login
          </Button>
          <div className={classes.link}>
            <Link
              href="register"
            >
              研究室新規登録はこちら
            </Link>
          </div>
        </LoginForm>
      ) : (
        <LoginForm pageTitle="" formTitle="autoLabPayment">
          <div className={classes.actions}>
            <Button
              color="secondary"
              variant="contained"
              onClick={handleLogin}
            >
              Googleログイン
            </Button>
          </div>
        </LoginForm>
      )}
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
  );
};

export default Login;
