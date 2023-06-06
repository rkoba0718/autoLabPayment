import React, { useState } from "react";
import Modal from "react-modal";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  CircularProgress,
  Container,
  Typography,
  Button,
  TextField,
  makeStyles,
  Theme,
  createStyles,
  useTheme
} from "@material-ui/core";


import { useUser, getDisplayName } from "lib/userAuth";
import { changeName } from "lib/editUserInfo";
import { useLab } from "lib/labAuth";
import Clock from "components/atoms/Clock";
import Error from "components/modal/Error";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
    field: {
			marginBottom: theme.spacing(3)
		},
	})
);

//Modalの大きさと位置の指定
const customStyles = {
	content: {
		width: "300px",
		height: "150px",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
};

const Settings: NextPage = () => {
  const user = useUser();
  const lab = useLab();
  const { isLoading, username } = getDisplayName(user, lab);
  const classes = useStyles(useTheme());

  const [newDisplayName, setNewDisplayName] = useState("");

  const router = useRouter();

  //モーダルの設定
  Modal.setAppElement("#__next");
	const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState("");

  const handleChangeDisplayName = (): void => {
    console.log(user, lab, newDisplayName);
    changeName(user, lab, newDisplayName)
      .then(() => router.reload())
      .catch((error) => {
        setError(error.message);
        setModalIsOpen(true);
        return;
      });
  };

  return (
    <>
      <Clock />
      <Container>
        <Typography variant="h6" >
          ユーザー名: {isLoading ? <CircularProgress /> : username}
        </Typography>
        <div className={classes.field} >
          <TextField
            required
            label="新しいユーザー名"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
        </div>
        <Button
          color="secondary"
          variant="contained"
          onClick={handleChangeDisplayName}
        >
          変更
        </Button>
      </Container>
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
export default Settings;
