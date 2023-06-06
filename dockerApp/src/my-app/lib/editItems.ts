import {
  addCategoryToDB,
  getItemsFromDB,
  addItemToDB,
  deleteItemFromDB,
  deleteCategoryFromDB,
  addHistoryToDB,
  updateBalance,
} from "../lib/operateFirebase";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export type Item = {
  name: string;
  price: number;
  description: string;
  isCoffee: boolean;
  category: string;
  imageURL?: string;
  gs?: string;
};

export type ItemsInCategory = { category: string; items: Item[] };

// 新規カテゴリの追加
export const addNewCategory = async (
  labId: string,
  newCategory: string
): Promise<void> => {
  if (newCategory === "") {
    throw new Error("カテゴリ名を入力してください");
  }
  await addCategoryToDB(labId, newCategory);
};

// 商品の取得
export const getItems = (
  labId: string
): { isLoading: boolean; items: ItemsInCategory[] } => {
  const defaultRes = {
    isLoading: true,
    items: [],
  };

  const [items, setItems] = useState(defaultRes);

  useEffect(() => {
    void (async () => {
      const tmp = await getItemsFromDB(labId);
      setItems({ isLoading: false, items: tmp });
    })();
  }, [labId]);

  return items;
};

// 商品の追加
export const addItem = async (
  labId: string,
  category: string,
  item: Item,
  image: File = null
): Promise<void> => {
  return await addItemToDB(labId, category, item, image);
};

// 商品の削除
export const deleteItem = async (
  labId: string,
  category: string,
  item_name: string
): Promise<void> => {
  return await deleteItemFromDB(labId, category, item_name);
};

// カテゴリの削除
export const deleteCategory = async (
  labId: string,
  category: string
): Promise<void> => {
  return await deleteCategoryFromDB(labId, category);
};

// 商品の購入
export const purchaseItem = async (
  labId: string,
  user: User,
  item: Item
): Promise<void> => {
  await addHistoryToDB(labId, user.uid, item);
  await updateBalance(labId, user.uid, item.price, item.isCoffee);
};
