import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LogOut, Pencil } from "lucide-react";
import Cookies from "js-cookie";
import { Section } from "../../Components/Section/Section";
import { Orders } from "../../modules/Orders/Orders";

export const Dashboard = () => {
  const { data } = useSelector((state) => state.user);
  const { avatar, firstName, lastName } = data;

  function Logout() {
    Cookies.remove("token");
    window.location.href = "/";
  }

  return (
    <Section className={""}>
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-center gap-3">
          <h1>
            {lastName}  {firstName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => Logout()}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-2xl font-bold"
          >
            Logout <LogOut size={14} />
          </button>
          <Link
            to={"add-goods"}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-2xl font-bold"
          >
            Yangi tavar +
          </Link>
        </div>
      </div>
      <br />
      <Orders />
    </Section>
  );
};
