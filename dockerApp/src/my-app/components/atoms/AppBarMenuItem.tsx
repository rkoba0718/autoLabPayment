import React from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { AccountCircle } from "mdi-material-ui";


type Props = {
	items: {
		label: string;
		onClick?: () => void;
	}[];
};

const AppBarMenuItem: React.FunctionComponent<Props> = ({ items }) => {
	const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

	const onIconClick: React.MouseEventHandler<HTMLElement> = (event) => {
		setAnchor(event.currentTarget);
	};

	const onClose = React.useCallback((): void => {
		setAnchor(null);
	}, [setAnchor]);

	return (
		<div>
			<IconButton onClick={onIconClick}>
				<AccountCircle/>
			</IconButton>
			<Menu
				keepMounted
				anchorEl={anchor}
				open={Boolean(anchor)}
				onClose={onClose}
			>
				{items.map(({ label, onClick }) => {
					return(
						<MenuItem
							key={label}
							onClick={(): void => {
								if ( onClick ) {
									onClick();
									onClose();
								}
							}}
						>
							{label}
						</MenuItem>
					);
				})}
			</Menu>
		</div>
	)
};

export default AppBarMenuItem;