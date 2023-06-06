import React, { useMemo } from "react";
import { NextPage } from "next";
import SplitPane from "react-split-pane";
import { useRouter } from "next/router";
import {
  Theme,
  useTheme,
  makeStyles,
  createStyles,
  Button,
  Container,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from "@material-ui/core";

import { useLab } from "../../lib/labAuth";
import { useUser, useIsAdmin, getBalance, getHistory, History } from "../../lib/userAuth";
import { historyDataSet } from "../../lib/history";
import Clock from "../../components/atoms/Clock";
import Table, { HistoryTableData } from "../../components/atoms/Table";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		pane: {
			flexGrow: 1,
			paddingTop: theme.spacing(8)
		},
    item: {
      paddingTop: theme.spacing(5),
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
    price: {
      paddingTop: theme.spacing(2),
      textAlign: "center",
    },
    admin: {
      display: "flex",
      justifyContent: "flex-end",
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    }
	})
);


//よく購入する商品のデータをセットする関数
const oftenPurchaseDataSet = (data: History, oftenPurchaseData: HistoryTableData) => {
  if ( oftenPurchaseData.length === 0 ) {
    const purchaseData = {
      category: data.item.category,
      name: data.item.name,
      price: data.item.price,
      times: 1
    };
    oftenPurchaseData.push(purchaseData);
  } else {
    let isUpdate = false
    oftenPurchaseData.map((o) => {
      if ( o.name === data.item.name ) {
        o.times += 1;
        isUpdate = true;
        return;
      }
    });
    if ( !isUpdate ) {
      const purchaseData = {
        category: data.item.category,
        name: data.item.name,
        price: data.item.price,
        times: 1
      };
      oftenPurchaseData.push(purchaseData);
    }
  }
  return;
}

const Mypage: NextPage = () => {
  const lab = useLab();
  const user = useUser();
  const { isAdmin } = useIsAdmin(user, lab);
  const { isLoading, balance, coffee_balance } = getBalance(user, lab);
  const classes = useStyles(useTheme());
  const router = useRouter();

  //ボタンクリックアクション
  const onPurchaseClick = () => router.push("/mypage/purchase");
  const onHistoryClick = () => router.push("/mypage/history");
  const onAdminClick = () => router.push("/mypage/admin");

  //商品の取得
  const { isLoading: isHistoryLoading, history } = getHistory(user, lab);

  //よく購入する商品のカラム
  const oftenPurchaseColumns = useMemo(
		() => [
			{
				Header: "カテゴリ",
				accessor: "category",
			},
			{
				Header: "商品名",
				accessor: "name",
			},
      {
        Header: "価格",
        accessor: "price",
      },
      {
        Header: "購入回数",
        accessor: "times"
      }
		],
		[]
	);

  //よく購入する商品のうち上位3つの商品データ
  const oftenPurchaseData: HistoryTableData = []
  const sortedOftenPurchaseData = useMemo(
    () => {
      history.map((h) => oftenPurchaseDataSet(h, oftenPurchaseData));
      return oftenPurchaseData.filter((o) => o.category !== "支払い").sort((a, b) => b.times - a.times).slice(0,3);
    },
    [history]
  );

  //購入履歴のカラム
  const historyColumns = useMemo(
		() => [
			{
				Header: "カテゴリ",
				accessor: "category",
			},
			{
				Header: "商品名",
				accessor: "name",
			},
      {
        Header: "価格",
        accessor: "price",
      },
      {
				Header: "日時",
				accessor: "date"
			},
		],
		[]
	);

  //最新3つの購入履歴のデータ
  const historyData = useMemo(
    () => {
      return history.map((h) => historyDataSet(h)).filter((h, i) => i < 3)
    },
    [history]
  );


  return (
    <>
      <Clock />
      <SplitPane split="horizontal" defaultSize="30%" className={classes.pane} >
        <SplitPane split="vertical" defaultSize="50%" className={classes.item} >
          <Container>
            <Box my={2}>
              <Typography variant="h6">
                支払い残高
              </Typography>
              <Divider />
              <Typography variant="h1" className={classes.price}>
                ¥. {isLoading ? <CircularProgress /> : balance}
              </Typography>
            </Box>
          </Container>
          <Container>
            <Box my={2}>
              <Typography variant="h6">
                コーヒー支払い残高
              </Typography>
              <Divider />
              <Typography variant="h1" className={classes.price}>
                ¥. {isLoading ? <CircularProgress /> : coffee_balance}
              </Typography>
            </Box>
          </Container>
        </SplitPane>
        <Container >
          <Container className={classes.item}>
            <Table caption="よく購入する商品" columns={oftenPurchaseColumns} data={sortedOftenPurchaseData} />
            <Button
              color="secondary"
              variant="contained"
              onClick={onPurchaseClick}
            >
              商品を購入
            </Button>
          </Container>
          <Container className={classes.item}>
            <Table caption="履歴" columns={historyColumns} data={historyData} />
            <Button
              color="secondary"
              variant="contained"
              onClick={onHistoryClick}
            >
              詳細を表示
            </Button>
          </Container>
          <Container className={classes.admin}>
            {isAdmin ? (
              <Button
                color="secondary"
                variant="contained"
                onClick={onAdminClick}
              >
                管理者画面を表示
              </Button>
            ) : null}
          </Container>
        </Container>
      </SplitPane>
    </>
  );
};

export default Mypage;
