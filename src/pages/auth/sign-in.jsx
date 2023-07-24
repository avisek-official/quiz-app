import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { useState } from "react";
import md5 from "md5";

export function SignIn() {
  const users = useSelector((state) => state.users.users);
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [signInBtnLoading, setSignInBtnLoading] = useState(false);
  const [signInError, setSignInError] = useState("");

  // ----------------------------------------------------------------
  // #region Functions
  // ----------------------------------------------------------------

  const _signIn = () => {
    setSignInBtnLoading(false);
    if (users.length > 0) {
      const userData = users.find((user) => user.username === username);
      if (userData) {
        if (userData.password === md5(password)) {
          window.sessionStorage.setItem("UserToken", userData.tokenID);
          navigate("/");
        } else {
          setSignInError("Invalid Password");
        }
      } else {
        setSignInError("Invalid Username");
      }
    } else {
      setSignInError("User not found");
    }
  };

  const handleSignIn = () => {
    if (username.trim().length === 0 || password.trim().length < 8) {
      if (username.trim().length === 0) {
        setUserNameError(true);
      }
      if (password.trim().length < 8) {
        setPasswordError(true);
      }
    } else {
      setSignInBtnLoading(true);
      _signIn();
    }
  };

  // #endregion Functions

  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        alt="sign in"
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
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            {signInError.length > 0 && (
              <Alert variant="gradient" color="red">
                {signInError}
              </Alert>
            )}
            <Input
              label="Username"
              size="lg"
              error={usernameError}
              value={username}
              onChange={(e) => {
                setUserName(e.target.value.toLowerCase());
                setUserNameError(false);
              }}
            />
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
              onClick={handleSignIn}
              disabled={signInBtnLoading}
            >
              {signInBtnLoading ? "Working..." : "Sign In"}
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Don't have an account?
              <Link to="/auth/sign-up">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignIn;
