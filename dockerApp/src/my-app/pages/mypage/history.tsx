import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import {
  Theme,
  useTheme,
  makeStyles,
  createStyles,
  Container,
} from "@material-ui/core";

import { useLab } from "../../lib/labAuth";
import { useUser, getHistory, getBalance } from "../../lib/userAuth";
import { historyDataSet } from "../../lib/history";
import Table from "../../components/atoms/Table";
import Clock from "../../components/atoms/Clock";
import Pagination from "../../components/atoms/Pagination";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
    item: {
      addingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
	})
);

// 1ページに表示するアイテムの数
const PAGE_SIZE = 20;

const History: NextPage = () => {
  const lab = useLab();
  const user = useUser();
  const classes = useStyles(useTheme());
  const router = useRouter();

  //商品の取得
  const { isLoading: isHistoryLoading, history } = getHistory(user, lab);

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

  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(0);

  // ページネーションの設定
  const pageCount = Math.ceil(history.length / PAGE_SIZE); // 総ページ数
  const offset = currentPage * PAGE_SIZE; // 表示するアイテムのオフセット
  const currentData = history.slice(offset, offset + PAGE_SIZE); // 現在のページのデータ

  // ページが変更されたときのハンドラ
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  //購入履歴のデータ
  const historyData = useMemo(
    () => {
      return currentData.map((h) => historyDataSet(h))
    },
    [currentData]
  );

  return (
    <>
      <Clock />
      <Container className={classes.item} >
        <Table caption="履歴" columns={historyColumns} data={historyData} />
        <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
      </Container>
    </>
  );
};
export default History;
