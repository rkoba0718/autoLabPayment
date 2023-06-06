import { useEffect, useState } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import {
  User,
  getAuth,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { useLab } from "lib/labAuth";
import {
  getHistoryFromDB,
  getUsersFromDB,
  getUserInfo,
} from "lib/operateFirebase";
import { useRouter } from "next/router";
import { app } from "./firebase";
import { recoilPersist } from "recoil-persist";
import { Item } from "./editItems";
import { MemberTableData } from "components/atoms/Table";

// recoilの永続化
const { persistAtom } = recoilPersist();

export type UserData = {
  userID: string;
  admin: boolean;
  balance: number;
  coffeeBalance: number;
  displayName: string;
};

export type History = {
  date: string;
  item: Item;
};

export type UserState = User | null;

//ユーザがログインしている場合はUser、ログインしていない場合はnull
export const userState = atom<UserState>({
  key: "userState",
  default: null,
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistAtom],
});

//Googleアカウントでログイン
export const userLogin = (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  return signInWithRedirect(auth, provider);
};

//ログアウト
export const userLogout = (): Promise<void> => {
  const auth = getAuth(app);
  return signOut(auth);
};

export const useUserAuth = (): boolean => {
  // 現在のisLoadingを取得。setIsLoadingは更新するための関数。
  const [isLoading, setIsLoading] = useState(true);

  //userStateを更新する関数を取得し、setUserに格納。
  const setUser = useSetRecoilState(userState);

  //setUserに関する副作用を設定
  useEffect(() => {
    //authを監視
    const auth = getAuth(app);
    return onAuthStateChanged(auth, (user) => {
      setUser(user); // userのStateを更新
      setIsLoading(false); // ステートをfalseに更新
    });
  }, [setUser]);

  return isLoading;
};

// user===nullの場合はリダイレクト
export const redirectByUserAuth = (): boolean => {
  // 現在のisLoadingを取得。setIsLoadingは更新するための関数。
  const [isLoading, setIsLoading] = useState(false);
  const user = useRecoilValue(userState);
  const router = useRouter();

  useEffect(() => {
    if (
      user === null &&
      router.pathname !== "/login" &&
      router.pathname !== "/register"
    ) {
      router.push("/login");
      setIsLoading(true);
    } else if (
      user !== null &&
      router.pathname === "/"
    ) {
      router.push("/mypage");
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  return isLoading;
};

// adminではない場合はリダイレクト
export const redirectByNotAdmin = (): boolean => {
  // 現在のisLoadingを取得。setIsLoadingは更新するための関数。
  const [isLoading, setIsLoading] = useState(false);
  const user = useRecoilValue(userState);
  const lab = useLab();
  const router = useRouter();

  useEffect(() => {
    if (router.pathname.indexOf("admin") == -1) {
      setIsLoading(false);
    } else if (lab == null || user == null) {
      router.push("/login");
      setIsLoading(true);
    } else {
      setIsLoading(true);
      void (async () => {
        const userInfo = await getUserInfo(lab, user);
        const isLabAdmin = userInfo.admin;
        if (!isLabAdmin) {
          router.push("/login");
        } else {
          setIsLoading(false);
        }
      })();
    }
  }, [user, lab, router]);

  return isLoading;
};

//UserStateを他のコンポーネントから取得するための関数
export const useUser = (): UserState => {
  return useRecoilValue(userState);
};

export const useIsAdmin = (
  user: User,
  labId: string
): { isLoading: boolean; isAdmin: boolean } => {
  const defaultRes = {
    isLoading: true,
    isAdmin: false,
  };
  const [isAdmin, setIsAdmin] = useState(defaultRes);
  useEffect(() => {
    void (async () => {
      const userInfo = await getUserInfo(labId, user);
      setIsAdmin({ isLoading: false, isAdmin: userInfo.admin });
    })();
  }, [user, labId]);

  return isAdmin;
};

export const getDisplayName = (
  user: User,
  labId: string
): { isLoading: boolean; username: string } => {
  const defaultRes = {
    isLoading: true,
    username: "",
  };
  // 現在のisLoadingを取得。setIsLoadingは更新するための関数。
  const [displayName, setDisplayName] = useState(defaultRes);
  useEffect(() => {
    void (async () => {
      const userInfo = await getUserInfo(labId, user);
      setDisplayName({ isLoading: false, username: userInfo.displayName });
    })();
  }, [user, labId]);

  return displayName;
};

export const getBalance = (
  user: User,
  labId: string
): { isLoading: boolean; balance: number; coffee_balance: number } => {
  const defaultRes = {
    isLoading: true,
    balance: 0,
    coffee_balance: 0,
  };
  const [balance, setBalance] = useState(defaultRes);

  useEffect(() => {
    void (async () => {
      const res = await getUserInfo(labId, user);
      setBalance({
        isLoading: false,
        balance: res.balance,
        coffee_balance: res.coffeeBalance,
      });
    })();
  }, [user, labId]);

  return balance;
};

export const getHistory = (
  user: User,
  labId: string
): { isLoading: boolean; history: History[] } => {
  const defaultRes = {
    isLoading: true,
    history: [] as History[],
  };
  const [history, setHistory] = useState(defaultRes);

  useEffect(() => {
    void (async () => {
      const tmp: History[] = await getHistoryFromDB(labId, user);
      tmp.reverse();
      setHistory({ isLoading: false, history: tmp });
    })();
  }, [user, labId]);
  return history;
};

export const getUsers = (
  labId: string
): { isLoading: boolean; users: UserData[] } => {
  const defaultRes = {
    isLoading: true,
    users: [] as UserData[],
  };
  const [users, setUsers] = useState(defaultRes);

  useEffect(() => {
    void (async () => {
      const tmp: UserData[] = await getUsersFromDB(labId);
      setUsers({ isLoading: false, users: tmp });
    })();
  }, [labId]);

  return users;
};

//研究室メンバー一覧を作成するための関数
export const memberDataSet = (data: UserData) => {
  return (
    {
      username: data.displayName,
      balance: data.balance,
      coffeeBalance: data.coffeeBalance,
      auth: data.admin ? "Admin" : "Guest"
    }
  );
};