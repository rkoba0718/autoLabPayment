import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core";
import React, { useState, useEffect } from "react";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		time: {
			textAlign: "right",
			paddingRight: theme.spacing(4),
		}
	})
);

const Clock: React.FunctionComponent = () => {
	//現在時刻を格納する変数
	const [time, setTime] = useState(new Date());

	//1秒ごとに時刻を更新
	useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const classes = useStyles(useTheme());


	return (
		<>
			<h3 className={classes.time}>
				{time.toLocaleDateString()} {time.toLocaleTimeString()}
			</h3>
		</>
	);
};

export default Clock;