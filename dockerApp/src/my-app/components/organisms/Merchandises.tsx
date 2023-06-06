import React, { useRef } from "react";
import { Container, Typography, makeStyles } from "@material-ui/core";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { User } from "firebase/auth";

import { ItemsInCategory } from "lib/editItems";
import Merchandise from "components/molecules/Merchandise";


type Props = {
	lab: string;
	user: User;
	item: ItemsInCategory;
	isAdmin: boolean;
};

const useStyles = makeStyles({
	container: {
		marginBottom: "30px",
	},
	merchandise: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
	},
	item: {
		marginRight: "30px",
	}
});

const Merchandises: React.FunctionComponent<Props> = ({ lab, user, item, isAdmin }) => {
	const classes = useStyles();

	//SliderコンポーネントへのRefを作成
	const sliderRef = useRef<Slider>(null);

	//Sliderの各種設定
	const settings = {
		slidesToShow: 6, // 一度に表示する要素の数
		slidesToScroll: 2, // 一度にスクロールする要素の数
		infinite: true,
		dots: true,
		arrows: true,
		responsive: [
			{
				breakpoint: 950,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 1,
				}
			},
			{
				breakpoint: 680,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				}
			},
			{
				breakpoint: 360,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				}
			}
		]
	};

	const renderMerchandises = () => {
		if ( item.items.length < 6 ) {
			return (
				<div className={classes.merchandise}>
					{item.items.map((i) => (
						<Merchandise lab={lab} user={user} category={item.category} item={i} isLessThan6={true} isAdmin={isAdmin} />
					))}
				</div>
			)
		} else {
			return (
				<Slider ref={sliderRef} {...settings}>
					{item.items.map((i) => (
						<Merchandise lab={lab} user={user} category={item.category} item={i} isLessThan6={false} isAdmin={isAdmin} />
					))}
				</Slider>
			);
		}
	};

	return (
		<Container className={classes.container}>
			<Typography variant="h5" >{item.category}</Typography>
			{renderMerchandises()}
		</Container>
	);
};

export default Merchandises;