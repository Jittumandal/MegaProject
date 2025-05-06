import {
  Anchor,
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import apiClient from "../../../service/apiClient";
import { useNavigate } from "react-router";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiClient.register(name, email, password); // yehan pe apiclint ka register function call ho raha hai

      console.log("response", data);
      //
      if (data.status) {
        navigate("/login");
        console.log(navigate("/login"));
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Api Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      align="center"
      justify="center"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Paper radius="md" p="xl" withBorder>
        <Text align="center" mb="lg" size="lg" fw={500}>
          Welcome to Mantine, with
          {error && <div>Error: {error}</div>}
        </Text>

        <form mt="md" onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              required
              label="Name"
              placeholder="Name"
              id="name"
              onChange={(e) => setName(e.target.value)}
            />
            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              id="paasword"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor component="button" type="button">
              Don't have an account? Register
            </Anchor>
            <Button type="submit" radius="xl" disabled={loading}>
              {loading ? "Signup....." : "Signup"}
            </Button>
          </Group>
        </form>
      </Paper>
    </Stack>
  );
};

export default Register;
