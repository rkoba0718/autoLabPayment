import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import Head from "next/head";
import { Theme, useTheme, makeStyles, createStyles, CssBaseline, ThemeProvider, CircularProgress } from "@material-ui/core";

import {
  useUserAuth,
  redirectByUserAuth,
  redirectByNotAdmin,
  useUser,
} from "../lib/userAuth";
import { redirectByLabAuth } from "../lib/labAuth";
import AppBarForm from "../components/organisms/AppBarForm";
import theme from "../styles/theme";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		content: {
			flexGrow: 1,
			paddingTop: theme.spacing(8)
		}
	})
);

type Props = {
  children: JSX.Element;
};

// ローディング中であればローディング画面を返し、そうでなければ子コンポーネントを返す
const Auth: React.FunctionComponent = ({ children }: Props) => {
  const isLoading1 = useUserAuth(); //認証中の場合はtrue
  const isLoading2 = redirectByLabAuth(); //リダイレクト中の場合はtrue
  const isLoading3 = redirectByUserAuth(); //リダイレクト中の場合はtrue
  const isLoading4 = redirectByNotAdmin();
  const isLoading = isLoading1 || isLoading2 || isLoading3 || isLoading4;
  return isLoading ? <p><CircularProgress /></p> : children;
};



function MyApp({ Component, pageProps, router }: AppProps) {
  const classes = useStyles(useTheme());
  return (
    <RecoilRoot>
        <Head>
          <title>autoLabPayment</title>
        </Head>
        <ThemeProvider theme={theme}>
          <Auth>
            <CssBaseline />
            <AppBarForm />
            <main className={classes.content}>
              <Component {...pageProps} />
            </main>
          </Auth>
        </ThemeProvider>
    </RecoilRoot>
  );
}

export default MyApp;
