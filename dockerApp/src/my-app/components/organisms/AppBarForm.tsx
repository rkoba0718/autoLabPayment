import React from "react";
import {
	Theme,
	AppBar,
	Toolbar,
	Typography,
	useTheme,
	makeStyles,
	createStyles,
	Button
} from "@material-ui/core";
import Link from "next/link";
import { useRecoilState } from "recoil";

import { useUser } from "lib/userAuth";
import { labState } from "lib/labAuth";
import AccountMenu from "../molecules/AccountMenu";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		bar: {
			backgroundColor: "#2E86C1"
		},
		title: {
			flexGrow: 1,
			color: "secondary"
		},
		titleLink: {
			textDecoration: "none",
			"&:visited": {
				color: "secondary"
			}
		}
	})
);

type Props = {
	menuIcon?: React.ReactNode;
}

const AppBarForm: React.FunctionComponent<Props> = React.memo(
	() => {
		const classes = useStyles(useTheme());
		const user = useUser();
		const [lab, setLab] = useRecoilState(labState);
		return (
			<AppBar position="fixed" className={classes.bar}>
				<Toolbar>
					<Typography variant="h6" noWrap className={classes.title}>
						{
							user !== null ? (
								<Link href="/mypage" className={classes.titleLink}>
									autoLabPayment
								</Link>
							) : (
								<>
									autoLabPayment
								</>
							)
						}
					</Typography>
					{
						user !== null && lab !== null ? (
							<AccountMenu />
						): (<></>)
					}
				</Toolbar>
			</AppBar>
		)
	}
);

export default AppBarForm;