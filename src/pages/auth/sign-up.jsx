import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Select,
  Option,
  Button,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { addUser, getUsersFetch } from "../../redux/userState";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import md5 from "md5";

function SignUp() {
  const users = useSelector((state) => state.users.users);
  const addedUser = useSelector((state) => state.users.addedUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [signupBtnLoading, setSignupBtnLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  // ----------------------------------------------------------------
  // #region Side Effects
  // ----------------------------------------------------------------

  useEffect(() => {
    if (addedUser !== undefined) {
      dispatch(getUsersFetch());
      if (users.find((user) => user.tokenID === addedUser.tokenID)) {
        setName("");
        setPassword("");
        setRole("");
        setUsername("");
        window.sessionStorage.setItem("UserToken", addedUser.tokenID);
        navigate("/");
      }
    }
    // eslint-disable-next-line
  }, [addedUser, users]);

  // #endregion Side Effects

  // ----------------------------------------------------------------
  // #region Functions
  // ----------------------------------------------------------------

  const _validateUserAndAdd = () => {
    if (users.length > 0) {
      if (users.find((user) => user.username === username.trim())) {
        setSignupBtnLoading(false);
        setSignupError("Username already in use");
      } else {
        _addUser();
      }
    } else {
      _addUser();
    }
  };

  const _addUser = () => {
    const createdAt = new Date().toLocaleString() + "";
    const userData = {
      createdAt,
      name,
      username: username.trim(),
      password: md5(password),
      role,
    };

    dispatch(addUser(userData));
  };

  const handleSignUp = () => {
    if (
      name.trim().length === 0 ||
      username.trim().length === 0 ||
      role.trim().length === 0 ||
      password.trim().length < 8
    ) {
      if (name.trim().length === 0) {
        setNameError(true);
      }
      if (username.trim().length === 0) {
        setUsernameError(true);
      }
      if (role.trim().length === 0) {
        setRoleError(true);
      }
      if (password.trim().length < 8) {
        setPasswordError(true);
      }
    } else {
      setSignupBtnLoading(true);
      _validateUserAndAdd();
    }
  };

  // #endregion Functions

  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        alt="signup-bg"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign Up
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            {signupError.length > 0 && (
              <Alert variant="gradient" color="red">
                {signupError}
              </Alert>
            )}
            <Input
              label="Name"
              size="lg"
              error={nameError}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(false);
              }}
            />
            <Input
              label="Username"
              size="lg"
              error={usernameError}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.toLowerCase());
                setUsernameError(false);
              }}
            />
            <Select
              label="Role"
              size="lg"
              error={roleError}
              value={role}
              onChange={(e) => {
                setRole(e);
                setRoleError(false);
              }}
            >
              <Option value="Teacher">Teacher</Option>
              <Option value="Student">Student</Option>
            </Select>
            <Input
              type="password"
              label="Password"
              size="lg"
              error={passwordError}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              fullWidth
              onClick={handleSignUp}
              disabled={signupBtnLoading}
            >
              {signupBtnLoading ? "Working..." : "Sign Up"}
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Already have an account?
              <Link to="/auth/sign-in">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignUp;
