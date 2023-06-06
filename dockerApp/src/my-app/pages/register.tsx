import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { NextPage } from "next";
import Link from "next/link";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { Button, makeStyles, Theme, createStyles, useTheme, TextField } from "@material-ui/core";

import { labState, labRegister } from "../lib/labAuth";
import { useUser } from "../lib/userAuth";
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

const Register: NextPage = () => {
  Modal.setAppElement("#__next");
  const [error, setError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const router = useRouter();
  const [labId, setLabId] = useState("");

  const user = useUser();
  const [, setLab] = useRecoilState(labState);
  const classes = useStyles(useTheme());

  // 研究室を追加し、そこにAdminとして登録者を追加する
  const handleLabRegister = (): void => {
    labRegister(labId, user, setLab)
      .then(() => {
        router.push("/mypage");
      })
      .catch((error) => {
        setError(error.message);
        setModalIsOpen(true);
      });
  };

  return (
    <>
      <LoginForm pageTitle="" formTitle="研究室新規登録">
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
          onClick={handleLabRegister}
        >
          Register
        </Button>
        <div className={classes.link}>
          <Link
            href="login"
          >
            ログイン画面はこちら
          </Link>
        </div>
      </LoginForm>
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

export default Register;
