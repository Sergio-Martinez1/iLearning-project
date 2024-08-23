"use client";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { FaUserShield } from "react-icons/fa6";
import { FaUserSlash } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const AdminPanel = () => {
  const [usersData, setUsersData] = useState([]);
  const [usersIds, setUsersIds] = useState([]);
  const checkboxRef = useRef(null);
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const res = await fetch(`${baseURL}/api/admins`);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setUsersData(data);
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  function checkAll(event) {
    const isChecked = event.target.checked;
    if (isChecked) {
      setUsersIds([]);
      usersData.forEach((user) => {
        setUsersIds((prevIds) => [...prevIds, user._id]);
      });
    } else {
      setUsersIds([]);
    }
    checkboxRef.checked = isChecked;
  }

  async function block() {
    usersIds.forEach(async (userId) => {
      const res = await fetch(`${baseURL}/api/admins/block/${userId}`, {
        method: "PUT",
      });
      if (res.status === 200) {
        const new_data = usersData.map((userData) => {
          if (userData._id === userId) userData.status = true;
          return userData;
        });
        setUsersData(new_data);
      }
    });
  }

  async function unBlock() {
    usersIds.forEach(async (userId) => {
      const res = await fetch(`${baseURL}/api/admins/unblock/${userId}`, {
        method: "PUT",
      });
      if (res.status === 200) {
        const new_data = usersData.map((userData) => {
          if (userData._id === userId) userData.status = false;
          return userData;
        });
        setUsersData(new_data);
      }
    });
  }

  async function set() {
    usersIds.forEach(async (userId) => {
      const res = await fetch(`${baseURL}/api/admins/set/${userId}`, {
        method: "PUT",
      });
      if (res.status === 200) {
        const new_data = usersData.map((userData) => {
          if (userData._id === userId) userData.role = "admin";
          return userData;
        });
        setUsersData(new_data);
      }
    });
  }

  async function unset() {
    usersIds.forEach(async (userId) => {
      const res = await fetch(`${baseURL}/api/admins/unset/${userId}`, {
        method: "PUT",
      });
      if (res.status === 200) {
        const new_data = usersData.map((userData) => {
          if (userData._id === userId) userData.role = "user";
          return userData;
        });
        setUsersData(new_data);
      }
    });
  }

  async function clear() {
    usersIds.forEach(async (userId) => {
      const res = await fetch(`${baseURL}/api/admins/delete/${userId}`, {
        method: "DELETE",
      });
      if (res.status === 200) {
        setUsersData((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
        setUsersIds((prevIds) => prevIds.filter((id) => id !== userId));
        if (
          checkboxRef.current &&
          checkboxRef.current.value === userId.toString()
        ) {
          checkboxRef.current.checked = false;
        }
      }
    });
  }

  function updateList(event, id) {
    const isChecked = event.target.checked;
    if (isChecked) {
      setUsersIds((prevIds) => [...prevIds, id]);
    } else {
      setUsersIds((prevIds) => prevIds.filter((userId) => userId !== id));
    }
    if (checkboxRef.current && checkboxRef.current.value === id.toString()) {
      checkboxRef.current.checked = isChecked;
    }
  }

  return (
    <main className="w-full h-full mx-auto flex-grow">
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="loader_1"></div>
        </div>
      ) : (
        <section className="flex flex-col w-[90%] mx-auto md:pt-8 pt-4">
          <section className="flex gap-x-2 sm:gap-x-4 mb-4 flex-wrap gap-y-2">
            <button
              className="border-black border-[2px] flex gap-x-2 md:gap-x-3 px-3 py-2 items-center justify-center bg-gray-500 font-bold hover:bg-gray-600 active:bg-gray-500 text-sm md:text-md"
              onClick={set}
            >
              <FaUserShield size={20} /> {t("button_set")}
            </button>
            <button
              className="border-black border-[2px] flex gap-x-2 md:gap-x-3 px-3 py-2 items-center justify-center bg-gray-500 font-bold hover:bg-gray-600 active:bg-gray-500 text-sm md:text-md"
              onClick={unset}
            >
              <FaUserSlash size={20} /> {t("button_unset")}
            </button>
            <div className="flex gap-x-2 sm:gap-x-4">
              <button
                className="border-black border-[2px] flex gap-x-3 px-3 py-2 items-center justify-center bg-gray-500 font-bold hover:bg-gray-600 active:bg-gray-500 text-sm md:text-md"
                onClick={block}
              >
                <FaLock /> {t("button_block")}
              </button>
              <button
                className="border-black border-[2px] p-2 w-12 flex justify-center items-center bg-lime-500 hover:bg-lime-600 active:bg-lime-500"
                onClick={unBlock}
              >
                <FaLockOpen />
              </button>
              <button
                className="border-black border-[2px] p-2 w-12 flex justify-center items-center bg-red-500 hover:bg-red-600 active:bg-red-500"
                onClick={clear}
              >
                <FaTrashAlt />
              </button>
            </div>
          </section>
          <section className="md:grid md:grid-cols-[80px_1fr_1fr_1fr_180px] bg-[var(--element-secondary-color)] border-[var(--border-color)] border-[1px] border-b-[0px] hidden">
            <div className="col-span-1 row-start-1 flex w-20 h-full justify-center items-center border-[var(--border-color)] border-[1px] border-b-[0px]">
              <input
                type="checkbox"
                onChange={(event) => {
                  checkAll(event);
                }}
              />
            </div>
            <span className="col-span-1 row-start-1 p-2 flex justify-center items-center border-[var(--border-color)] border-[1px] border-b-[0px]">
              {t("column_username")}
            </span>
            <span className="col-span-1 row-start-1 p-2 flex justify-center items-center border-[var(--border-color)] border-[1px] border-b-[0px]">
              {t("column_email")}
            </span>
            <span className="col-span-1 row-start-1 p-2 flex justify-center items-center border-[var(--border-color)] border-[1px] border-b-[0px]">
              {t("column_role")}
            </span>
            <span className="col-span-1 row-start-1 p-2 flex justify-center items-center border-[var(--border-color)] border-[1px] border-b-[0px]">
              {t("column_status")}
            </span>
          </section>
          <div className="md:border-[var(--border-color)] md:border-[1px] md:border-t-[0px]">
            {usersData.map((user, index) => (
              <div
                className={
                  index % 2 === 0
                    ? "bg-[var(--element-color)]"
                    : "bg-[var(--element-secondary-color)]"
                }
                key={index}
              >
                <div
                  className="grid grid-cols-[1fr_2fr_3fr] grid-flow-row md:grid-flow-col md:grid-cols-[80px_1fr_1fr_1fr_180px] p-2 md:p-0"
                  key={index}
                >
                  <div className="col-span-1 row-span-4 self-center justify-self-center md:row-span-1 md:col-span-1 md:flex md:w-20 md:h-full md:justify-center md:items-center md:border-[var(--border-color)] md:border-[1px] md:border-t-[0px] md:border-b-[0px]">
                    <input
                      ref={checkboxRef}
                      className="p-2 w-4 h-4 cursor-pointer"
                      type="checkbox"
                      id=""
                      value={user._id}
                      checked={usersIds.includes(user._id)}
                      onChange={(event) => {
                        updateList(event, user._id);
                      }}
                    />
                  </div>
                  <span className="col-start-2 md:hidden">{t("column_username")}:</span>
                  <span className="md:col-span-1 md:p-2 md:flex md:justify-center md:items-center md:border-[var(--border-color)] md:border-[1px] md:border-t-[0px] md:border-b-[0px]">
                    <span
                      className={
                        user.status === true
                          ? "opacity-40"
                          : "text-[var(--text-color)]"
                      }
                    >
                      {user.username}
                    </span>
                  </span>
                  <span className="col-start-2 md:hidden">{t("column_email")}:</span>
                  <span className="md:col-span-1 md:p-2 md:flex md:justify-center md:items-center md:border-[var(--border-color)] md:border-[1px] md:border-t-[0px] md:border-b-[0px]">
                    <span
                      className={`
                      ${
                        user.status === true
                          ? "opacity-40"
                          : "text-[var(--text-color)]"
                      } 
                    `}
                    >
                      {user.email}
                    </span>
                  </span>
                  <span className="col-start-2 md:hidden">{t("column_role")}:</span>
                  <span className="md:col-span-1 md:p-2 md:flex md:justify-center md:items-center md:border-[var(--border-color)] md:border-[1px] md:border-t-[0px] md:border-b-[0px]">
                    <span
                      className={
                        user.status === true
                          ? "opacity-40"
                          : "text-[var(--text-color)]"
                      }
                    >
                      {user.role}
                    </span>
                  </span>
                  <span className="col-start-2 md:hidden">{t("column_status")}:</span>
                  <span className="md:col-span-1 md:p-2 md:flex md:justify-center md:items-center md:border-[var(--border-color)] md:border-[1px] md:border-t-[0px] md:border-b-[0px]">
                    <span
                      className={
                        user.status === true
                          ? "opacity-40"
                          : "text-[var(--text-color)]"
                      }
                    >
                      {user.status ? "Blocked" : "Non-blocked"}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default AdminPanel;
