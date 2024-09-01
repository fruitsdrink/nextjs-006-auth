import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import SigninButton from "./signin-button";

const Appbar = () => {
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link
            className="hover:text-sky-500 transition-colors"
            color="foreground"
            href="/"
          >
            Home
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <SigninButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Appbar;
