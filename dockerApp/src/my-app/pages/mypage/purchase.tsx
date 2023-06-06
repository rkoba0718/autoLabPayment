import { NextPage } from "next";
import React from "react";
import { Container, CircularProgress } from "@material-ui/core";


import { useLab } from "lib/labAuth";
import { useUser } from "lib/userAuth";
import { getItems } from "lib/editItems";
import Clock from "components/atoms/Clock";
import Merchandises from "components/organisms/Merchandises";

const Purchase: NextPage = () => {

  const lab = useLab();
  const user = useUser();

  //商品の取得
  const { isLoading, items } = getItems(lab);

  return (
    <>
      <Clock />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Container>
          {items.map((item) => {
            return <Merchandises lab={lab} user={user} item={item} isAdmin={false} />
          })}
        </Container>
      )}
    </>
  );
};
export default Purchase;
