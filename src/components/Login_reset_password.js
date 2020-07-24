import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import auth from "@react-native-firebase/auth";

export default function Login_reset_password({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [error, seterror] = React.useState("");
  const [wait, setWait] = React.useState(false);

  const validation = React.useCallback(() => {
    const email_trimmed = email.toLowerCase().trim();
    if (email_trimmed == "") {
      seterror("Email cannot be empty.");
      return true;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i.test(email_trimmed)
    ) {
      seterror("Email format is not valid.");
      return true;
    } else {
      seterror("");
      return false;
    }
  });

  const sendEmail = () => {
    const validate = validation();
    if (validate) return;
    //check if user exists in our database already
    setWait(true);
    const email_trimmed = email.toLowerCase().trim();
    auth()
      .sendPasswordResetEmail(email_trimmed)
      .then((data) => {
        navigation.navigate("ResetPassEmailSent");
        setWait(false);
      })
      .catch((error) => {
        setWait(false);
        if (error.code === "auth/invalid-email") {
          seterror("Email format is not valid.");
        } else if (error.code === "auth/user-not-found") {
          seterror("Email not found");
        } else {
          seterror("Something went wrong");
        }
        console.log(error);
      });
  };

  if (wait) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="rgb(0, 103, 187)" />
      </View>
    );
  } else
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../../images/BT_logoWithName.png")}
          resizeMode="contain"
        />
        <Text style={styles.header}> Reset your password</Text>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Submit your email</Text>

          <TextInput
            autoCorrect={true}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            style={styles.textInput}
          />
          {error !== "" && (
            <View style={{ width: "100%" }}>
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
          )}
          <TouchableOpacity
            title="goToEmail"
            style={styles.goToEmail}
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <Text style={styles.labelEmail}>Go to login</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.scan}
          title="SendEmail"
          onPress={sendEmail}
        >
          <Text style={styles.button}>Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFF5",
    marginHorizontal: 18,
  },
  button: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
  },
  labelEmail: {
    fontSize: 12,
    color: "#rgb(0, 103, 187)",
    textAlign: "right",
  },
  errorMessage: {
    fontSize: 12,
    color: "red",
    textAlign: "left",
  },
  goToEmail: {
    width: "100%",
  },
  scan: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    borderRadius: 10,
    backgroundColor: "#rgb(0, 103, 187)",
    marginBottom: 100,
  },
  logo: {
    width:90, 
    height:90, 
    alignSelf:'center',
    marginBottom: 20,
    marginTop: 20,
  },
  header: {
    flex: 0.3,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  root: {
    flex: 1,
    flexDirection: "column",
  },
  rowContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  text: {
    flex: 1,
  },
  textInput: {
    width: "100%",
    marginTop: 10,
    paddingLeft: 6,
    borderRadius: 10,
    backgroundColor: "white",
  },
});
