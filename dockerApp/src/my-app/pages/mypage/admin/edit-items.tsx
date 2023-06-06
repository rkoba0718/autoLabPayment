import { NextPage } from "next";
import React, { useState, useMemo } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  useTheme,
  Container,
  CircularProgress,
  Button
} from "@material-ui/core";
import Modal from "react-modal";

import { useLab } from "lib/labAuth";
import { getItems } from "lib/editItems";
import { useUser } from "lib/userAuth";
import Merchandises from "components/organisms/Merchandises";
import Add from "components/modal/category/Add";
import Delete from "components/modal/category/Delete";
import ItemModal from "components/modal/Item";

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
const addCategoryModalStyles = {
	content: {
		width: "350px",
		height: "230px",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
};

//Modalの大きさと位置の指定
const deleteCategoryModalStyles = {
	content: {
		width: "400px",
		height: "230px",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
};

//Modalの大きさと位置の指定
const itemModalStyles = {
	content: {
		width: "400px",
		height: "580px",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	},
};

const EditItems: NextPage = () => {
  const classes = useStyles(useTheme());
  //モーダル
  Modal.setAppElement("#__next");
  const [addCategoryModalIsOpen, setAddCategoryModalIsOpen] = useState(false);
  const [deleteCategoryModalIsOpen, setDeleteCategoryModalIsOpen] = useState(false);
  const [itemModalIsOpen, setItemModalIsOpen] = useState(false);

  const lab = useLab();
  const user = useUser();

  //商品の取得
  const { isLoading, items } = getItems(lab);

  //BalanceModalで選択できるユーザー一覧
	const categoryOptions = useMemo(() => {
		return items.map((item, i) => ({
			value: i.toString(),
			label: item.category
		}));
	}, [items]);

  return (
    <>
      <Container className={classes.buttonContainer}>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => setAddCategoryModalIsOpen(true)}
          className={classes.button}
        >
          カテゴリ追加
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => setDeleteCategoryModalIsOpen(true)}
          className={classes.button}
        >
          カテゴリ削除
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => setItemModalIsOpen(true)}
          className={classes.button}
        >
          商品追加
        </Button>
      </Container>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Container>
          {items.map((item) => {
            return <Merchandises lab={lab} user={user} item={item} isAdmin={true} />
          })}
        </Container>
      )}
      <Modal
        isOpen={addCategoryModalIsOpen}
        style={addCategoryModalStyles}
      >
        <Add
          lab={lab}
          onCloseClick={() => setAddCategoryModalIsOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={deleteCategoryModalIsOpen}
        style={deleteCategoryModalStyles}
      >
        <Delete
          items={items}
          lab={lab}
          options={categoryOptions}
          onCloseClick={() => setDeleteCategoryModalIsOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={itemModalIsOpen}
        style={itemModalStyles}
      >
        <ItemModal
          items={items}
          lab={lab}
          options={categoryOptions}
          onCloseClick={() => setItemModalIsOpen(false)}
        />
      </Modal>
    </>
  );
};
export default EditItems;
