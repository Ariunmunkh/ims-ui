import React from "react";
import useUserInfo from "../../system/useUserInfo";

import HomeVolunteer from "./HomeVolunteer";
import HomeBranch from "./HomeBranch";
import HomeAdmin from "./HomeAdmin";

export default function Home() {
  const { userinfo } = useUserInfo();

  return userinfo.roleid === "5" ? (
    <HomeVolunteer />
  ) : userinfo.roleid === "2" ? (
    <HomeBranch />
  ) : (
    <>
      <HomeAdmin />
    </>
  );
}
