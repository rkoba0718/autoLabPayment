import { User } from "firebase/auth";

import {
  changeDisplayName,
  updateBalance,
  addHistoryToDB,
  changeUserAuth,
} from "lib/operateFirebase";

import { Item } from "./editItems";

export const changeName = async (
  user: User,
  labId: string,
  newName: string
) => {
  if (newName === "") {
    throw new Error("名前を入力してください");
  }
  console.log("changeName", newName);
  await changeDisplayName(labId, user, newName);
};

export const reduceBalance = async (
  labId: string,
  userID: string,
  amount: number,
  coffee_flag: boolean
) => {
  const tmp: Item = {
    name: "-",
    category: "支払い",
    price: -amount,
    description: "",
    isCoffee: coffee_flag,
  };
  await Promise.all([
    updateBalance(labId, userID, -amount, coffee_flag),
    addHistoryToDB(labId, userID, tmp),
  ]);
};

export const changeAuth = async (labId: string, userID: string) => {
  await changeUserAuth(labId, userID);
};
