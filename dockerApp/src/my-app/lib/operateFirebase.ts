import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { ItemsInCategory, Item } from "lib/editItems";
import { History, UserData } from "lib/userAuth";
import { storage } from "./firebase";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getStorage,
} from "firebase/storage";

/*
  研究室登録に関する関数
*/

// 研究室を追加する関数
export const addLab = async (labId: string, user: User): Promise<void> => {
  const db = getFirestore();

  const docRef = doc(db, "Labs", labId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    throw new Error(`${labId}は既に登録されています`);
  }

  //新規登録
  await setDoc(docRef, {}, { merge: true });

  // 作成者をAdminとして追加
  await addUser(labId, user, true);
};

/*
  ユーザに関する関数
*/

// 研究室にユーザを追加する関数
export const addUser = async (
  labId: string,
  user: User,
  adminFlag: boolean
): Promise<void> => {
  const db = getFirestore();

  const labDocRef = doc(db, "Labs", labId);
  const labDocSnap = await getDoc(labDocRef);

  if (!labDocSnap.exists()) {
    throw new Error(`${labId}は登録されていません`);
  }

  const path = `Labs/${labId}/Users`;
  const userDocRef = doc(db, path, user.uid);
  const userDocSnap = await getDoc(userDocRef);

  //既にユーザが登録されている場合は追加しない
  if (userDocSnap.exists()) {
    return;
  }

  // ユーザーのドキュメントを作成
  const historyRef = doc(db, path, user.uid);
  await setDoc(
    historyRef,
    {
      displayName: user.displayName,
      admin: adminFlag,
      balance: 0,
      coffee_balance: 0,
    },
    { merge: true }
  );
};

//ユーザの表示名を変更する関数
export const changeDisplayName = async (
  labId: string,
  user: User,
  newName: string
): Promise<void> => {
  const db = getFirestore();
  const path = `Labs/${labId}/Users`;
  const userDocRef = doc(db, path, user.uid);

  await updateDoc(userDocRef, {
    displayName: newName,
  });
};

//ユーザの情報を取得する関数
export const getUserInfo = async (
  labId: string,
  user: User
): Promise<UserData> => {
  const db = getFirestore();
  const path = `Labs/${labId}/Users`;
  const userDocRef = doc(db, path, user.uid);
  const userDocSnap = await getDoc(userDocRef);

  const res: UserData = {
    userID: userDocSnap.id,
    admin: userDocSnap.data().admin,
    balance: userDocSnap.data().balance,
    coffeeBalance: userDocSnap.data().coffee_balance,
    displayName: userDocSnap.data().displayName,
  };

  return res;
};

// 残高を変更する関数
export const updateBalance = async (
  labId: string,
  userID: string,
  price: number,
  isCoffee: boolean
): Promise<void> => {
  const db = getFirestore();
  const path = `Labs/${labId}/Users/${userID}`;
  const userRef = doc(db, path);
  const userSnap = await getDoc(userRef);

  if (isCoffee) {
    await updateDoc(userRef, {
      coffee_balance: userSnap.data().coffee_balance + price,
    });
  } else {
    await updateDoc(userRef, {
      balance: userSnap.data().balance + price,
    });
  }
};

// 履歴を取得する関数
export const getHistoryFromDB = async (
  labId: string,
  user: User
): Promise<History[]> => {
  const db = getFirestore();
  const path = `Labs/${labId}/Users/${user.uid}/History`;
  const historyRef = collection(db, path);
  const historySnap = await getDocs(historyRef);
  let res: History[] = [];
  historySnap.forEach((doc) => {
    const history: History = {
      item: doc.data().item,
      date: doc.id,
    };
    res.push(history);
  });
  return res;
};

//商品を購入する関数
export const addHistoryToDB = async (
  labId: string,
  userId: string,
  item: Item
): Promise<void> => {
  const db = getFirestore();
  const path = `Labs/${labId}/Users/${userId}/History`;
  const historyRef = doc(db, path, Date.now().toString());
  const historySnap = await getDoc(historyRef);

  if (historySnap.exists()) {
    throw new Error("再試行してください");
  }

  await setDoc(historyRef, {
    item,
  });
};

// 研究室に所属している全てのユーザの情報を取得する関数
export const getUsersFromDB = async (labId: string): Promise<UserData[]> => {
  const db = getFirestore();
  const path = `Labs/${labId}/Users`;

  const userRef = collection(db, path);
  const userSnap = await getDocs(userRef);
  let res: UserData[] = [];
  userSnap.forEach((doc) => {
    const user: UserData = {
      userID: doc.id,
      admin: doc.data().admin,
      balance: doc.data().balance,
      coffeeBalance: doc.data().coffee_balance,
      displayName: doc.data().displayName,
    };
    res.push(user);
  });

  return res;
};

// ユーザの権限を変更する関数
export const changeUserAuth = async (
  labId: string,
  userId: string
): Promise<void> => {
  const db = getFirestore();
  const path = `Labs/${labId}/Users/${userId}`;
  const userRef = doc(db, path);
  const userSnap = await getDoc(userRef);

  await updateDoc(userRef, {
    admin: !userSnap.data().admin,
  });
};

/*
  商品に関する関数
*/

//カテゴリを追加する関数
export const addCategoryToDB = async (
  labId: string,
  category: string
): Promise<void> => {
  const db = getFirestore();
  const path = `Labs/${labId}/Items/${category}`;
  const itemRef = doc(db, path);
  const itemSnap = await getDoc(itemRef);

  if (itemSnap.exists()) {
    throw new Error(`${category}は既に登録されています`);
  }

  await setDoc(itemRef, {}, { merge: true });
};

//商品を取得する関数
export const getItemsFromDB = async (
  labId: string
): Promise<ItemsInCategory[]> => {
  const db = getFirestore();
  const path = `Labs/${labId}/Items`;

  const itemSnap = await getDocs(collection(db, path));
  let res: ItemsInCategory[] = [];
  itemSnap.forEach((doc) => {
    let tmp: Item[] = [];

    for (let key in doc.data()) {
      let item: Item = {
        name: key,
        price: doc.data()[key]["price"],
        description: doc.data()[key]["description"],
        isCoffee: doc.data()[key]["isCoffee"],
        category: doc.id,
      };
      if (doc.data()[key].hasOwnProperty("imageURL")) {
        item.imageURL = doc.data()[key]["imageURL"];
      }
      tmp.push(item);
    }

    const items: ItemsInCategory = {
      category: doc.id,
      items: tmp,
    };

    res.push(items);
  });

  return res;
};

//商品を追加する関数
export const addItemToDB = async (
  labId: string,
  category: string,
  item: Item,
  image: File = null
): Promise<void> => {
  const db = getFirestore();
  const path = `Labs/${labId}/Items/${category}`;

  const itemRef = doc(db, path);
  const itemSnap = await getDoc(itemRef);

  if (itemSnap.data()[item.name]) {
    throw new Error(`${item.name}は既に登録されています`);
  }

  let imageURL = "";
  let gs = "";
  if (image != null) {
    [gs, imageURL] = await uploadImage(image);
  } else {
    [gs, imageURL] = await setDefaultImage();
  }

  await setDoc(
    itemRef,
    {
      [item.name]: {
        price: item.price,
        description: item.description,
        isCoffee: item.isCoffee,
        imageURL,
        gs,
      },
    },
    { merge: true }
  );
};

//商品を削除する関数
export const deleteItemFromDB = async (
  labId: string,
  category: string,
  itemName: string
): Promise<void> => {
  const db = getFirestore();
  const path = `Labs/${labId}/Items/${category}`;

  const categoryRef = doc(db, path);
  const itemSnap = await getDoc(categoryRef);

  if (!itemSnap.data()[itemName]) {
    throw new Error(`${itemName}は登録されていません`);
  }

  if (
    itemSnap.data()[itemName].hasOwnProperty("gs") &&
    itemSnap.data()[itemName].gs !== "gs://autolabpayment.appspot.com/images/noImage.png"
  ) {
    console.log("delete");
    await deleteImage(itemSnap.data()[itemName].gs);
  }

  await updateDoc(categoryRef, { [itemName]: deleteField() });
};

//カテゴリを削除する関数
export const deleteCategoryFromDB = async (
  labId: string,
  category: string
): Promise<void> => {
  const db = getFirestore();
  const path = `Labs/${labId}/Items/${category}`;

  const categoryRef = doc(db, path);
  await deleteDoc(categoryRef);
};

// 画像をアップロードする関数
export const uploadImage = async (image: File) => {
  let uploadResult = "";
  const storageRef = ref(storage);
  const ext = image.name.split(".").pop();
  const name = Date.now().toString();
  const fullPath = "/images/" + name + "." + ext;
  const uploadRef = ref(storageRef, fullPath);

  console.log("uploading...");
  // 'file' comes from the Blob or File API
  await uploadBytes(uploadRef, image).then(async function (result) {
    await getDownloadURL(uploadRef).then(function (url) {
      uploadResult = url;
    });
  });
  console.log(uploadResult);
  const gs = "gs://autolabpayment.appspot.com" + fullPath;

  return [gs, uploadResult];
};

//デフォルト画像(noImage.png)をセットする関数
export const setDefaultImage = async () => {
  const imageRef = ref(getStorage(), "images/noImage.png");
  const downloadURL = await getDownloadURL(imageRef);
  const gs = "gs://autolabpayment.appspot.com/images/noImage.png";
  return [gs, downloadURL];
};

export const deleteImage = async (gs: string) => {
  const gsRef = ref(storage, gs);
  await deleteObject(gsRef);
};
