import { History } from "../lib/userAuth";


// タイムスタンプ->yyyy/mm/dd hh:mmに変換
export const timestampToTime = (timestamp: string) => {
	const date = new Date(Number(timestamp));
	const yyyy = `${date.getFullYear()}`;
	const MM = `0${date.getMonth() + 1}`.slice(-2);
	const dd = `0${date.getDate()}`.slice(-2);
	const HH = `0${date.getHours()}`.slice(-2);
	const mm = `0${date.getMinutes()}`.slice(-2);
	return `${yyyy}/${MM}/${dd} ${HH}:${mm}`;
};

//購入履歴データをセットする関数
export const historyDataSet = (data: History) => {
	return (
	  {
		date: timestampToTime(data.date),
		category: data.item.category,
		name: data.item.name,
		price: data.item.price
	  }
	);
};