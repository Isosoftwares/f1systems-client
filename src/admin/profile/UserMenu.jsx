import React from "react";
import { Menu, Button, Avatar, Text, Divider, Modal } from "@mantine/core";
import {
  IconUser,
  IconLock,
  IconLogout,
  IconChevronDown,
} from "@tabler/icons-react";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import useLogout from "../../hooks/useLogout";
import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";
import avatarr from "../../assets/graphics/avatar.png";
import { MdArrowDropDown, MdOutlinePassword } from "react-icons/md";
import useAuth from "../../hooks/useAuth";

function UserMenu() {
  const { auth } = useAuth();
  const [logoutOpened, { open: openLogout, close: closeLogout }] =
    useDisclosure(false);
  const navigate = useNavigate();
  const logOut = useLogout();

  const signOut = async () => {
    await logOut();
    navigate("/");
  };

  return (
    <div className="flex justify-center">
      {/* Logout Modal */}
      <Modal
        opened={logoutOpened}
        onClose={closeLogout}
        title={
          <div className="flex items-center gap-2">
            <FaSignOutAlt className="text-primary" />
            <span className="font-bold text-dark">Confirm Logout</span>
          </div>
        }
        centered
        radius="lg"
        size="sm"
        styles={{
          content: {
            backgroundColor: "#fff",
            border: "1px solid #eb9c35",
          },
          header: {
            backgroundColor: "#fff7ed",
            borderBottom: "1px solid #eb9c35",
          },
        }}
      >
        <div className="py-4">
          <p className="text-gray-700 mb-6">
            Are you sure you want to sign out?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeLogout}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-300 bg-gray-200 hover:bg-gray-300 text-gray-700 hover:shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={signOut}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-300 text-white hover:shadow-lg transform hover:scale-105"
              style={{ backgroundColor: "#c4511b" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#a03815")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#c4511b")}
            >
              Sign Out
            </button>
          </div>
        </div>
      </Modal>
      <Menu shadow="md" width={300} position="bottom-end" classNames="">
        <Menu.Target>
          <Button
            variant="subtle"
            className="hover:bg-dark/10 px-3 border border-primary rounded-lg"
          >
            <div className="flex items-center space-x-1 ">
              <Avatar size="sm" color="white" src={avatarr}></Avatar>
              <Text
                size="md"
                className="hidden text-primary font-bold md:inline"
                weight={500}
              >
                {auth?.user?.userName}
              </Text>
              <MdArrowDropDown size={23} className="text-primary" />
            </div>
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label className="bg-dark/80 rounded-sm py-2 text-light  ">
            Account Settings
          </Menu.Label>

          <Divider />
          <Menu.Item leftSection={<IconUser size={14} />}>
            <Link to="/dashboard/profile" className="flex items-center gap-2">
              <FaUserCircle />
              <span>Profile</span>
            </Link>
          </Menu.Item>

          <Divider />
          {/* <Menu.Item leftSection={<IconLock size={14} />}>
            <Link
              to="/dashboard/change-password"
              className="flex items-center gap-2"
            >
              <MdOutlinePassword />
              <span>Change Password</span>
            </Link>
          </Menu.Item> */}

          <Divider />

          <Menu.Item leftSection={<IconLogout size={14} />}>
            <button
              onClick={openLogout}
              className="flex items-center w-full justify-center gap-3  px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-md bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105"
            >
              <p className="hidden sm:inline">Logout</p>
              <FaSignOutAlt className="w-4 h-4" />
            </button>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

export default UserMenu;
