import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { onLogin, onRegister } = useAuth()
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFields = () => {
    let isValid = true;

    if (!validateEmail(form.email)) {
      setEmailError('Adresse email incorrecte.');
      isValid = false;
      return;
    } else {
      setEmailError('');
    }

    if (!form.password) {
      setPasswordError('Le mot de passe est obligatoire.');
      isValid = false;
      return;
    } else {
      setPasswordError('');
    }

    return isValid;
  };
  const login = async () => {
    if (validateFields()) {
      try {
        setLoading(true);
        const result = await onLogin!(form.email.trim(), form.password.trim());
        if (result.status !== 200) {
          setEmailError("Adresse email ou mot de passe incorrecte.");
        }
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenue!</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center', }}>
            <Image
              style={{ width: 120, height: 120 }}
              source={require("../../assets/logo1.png")}
            />
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Adresse email</Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={email => setForm({ ...form, email })}
              placeholder="accesslog@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.email} />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Mot de passe</Text>

            <TextInput
              autoCorrect={false}
              onChangeText={password => setForm({ ...form, password })}
              placeholder="**************"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password} />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity
              onPress={login}>
              <View style={styles.btn}>
                {loading ? (
                  <Text style={styles.btnText}> <ActivityIndicator size={17} color="white" style={{ marginRight: 8 }} /> Connexion</Text>
                ) : (
                  <View><Text style={styles.btnText}>Connexion</Text></View>
                )}
              </View>
            </TouchableOpacity>
          </View>
          {emailError ? <Text style={{ color: 'red' }}>{emailError}</Text> : null}
          {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    marginVertical: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d1d1d',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  /** Form */
  form: {
    marginBottom: 24,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },
});