import { useEffect, useState } from "react";
import { atom, useRecoilValue } from "recoil";
import { addUser, addLab } from "../lib/operateFirebase";
import { recoilPersist } from "recoil-persist";

import { useRouter } from "next/router";
import { UserState } from "./userAuth";

const { persistAtom } = recoilPersist();

type LabState = string | null;

export const labState = atom<LabState>({
  key: "labState",
  default: null,
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistAtom],
});

//研究室新規登録
export const labRegister = async (
  labId: string,
  user: UserState,
  setLab
): Promise<void> => {
  if (user === null) {
    throw new Error("googleでログインしてください");
  }
  if (labId === "") {
    throw new Error("研究室IDを入力してください");
  }
  return addLab(labId, user).then(() => {
    setLab(labId);
    console.log(
      `${labId}を登録し、${user.displayName}をadminとして追加しました`
    );
  });
};

//研究室ログイン
export const labLogin = async (
  labId: string,
  user: UserState,
  setLab
): Promise<void> => {
  if (user === null) {
    throw new Error("googleでログインしてください");
  }
  if (labId === "") {
    throw new Error("研究室IDを入力してください");
  }

  return addUser(labId, user, false).then(() => {
    setLab(labId);
    console.log(`${labId}に${user.displayName}としてログインしました`);
  });
};

//研究室ログアウト
export const labLogout = async (lab: string, setLab) => {
  if (lab === null) {
    throw new Error("研究室にログインしていません");
  }
  setLab(null);
};

// lab===nullの場合はリダイレクト
export const redirectByLabAuth = (): boolean => {
  // 現在のisLoadingを取得。setIsLoadingは更新するための関数。
  const [isLoading, setIsLoading] = useState(false);
  const lab = useRecoilValue(labState);
  const router = useRouter();

  useEffect(() => {
    if (
      lab === null &&
      router.pathname !== "/login" &&
      router.pathname !== "/register"
    ) {
      router.push("/login");
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [lab, router]);

  return isLoading;
};

// //LabStateを他のコンポーネントから取得するための関数
export const useLab = (): LabState => {
  return useRecoilValue(labState);
};
