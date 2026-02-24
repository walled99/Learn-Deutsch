/**
 * LernDeutsch AI - Sign Up Screen
 */

import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

// Try to import haptics — graceful fallback if not installed
let Haptics: any = null;
try {
  Haptics = require("expo-haptics");
} catch {
  // expo-haptics not installed
}
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer, Input, Button, Header } from "../../components";
import { useAuth } from "../../hooks";
import { COLORS, TYPOGRAPHY, SPACING } from "../../theme";
import {
  isValidEmail,
  getPasswordStrength,
  getPasswordErrors,
} from "../../utils/validation";
import type { AuthStackParamList } from "../../types";

type SignUpNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "SignUp"
>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpNavigationProp>();
  const { signUp } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password],
  );

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const pwErrors = getPasswordErrors(password);
      if (pwErrors.length > 0) {
        newErrors.password = pwErrors.join(", ");
      }
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    // Haptic feedback
    try {
      if (Haptics) await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch { }

    setIsLoading(true);
    const result = await signUp(email, password, displayName);
    setIsLoading(false);

    if (result.success) {
      Alert.alert(
        "Account Created! ✨",
        "We've sent a verification email to " +
        email.trim() +
        ". Please verify your email before signing in.",
        [
          {
            text: "Go to Login",
            onPress: () => navigation.navigate("Login"),
          },
        ],
      );
    } else {
      Alert.alert("Sign Up Failed", result.error || "Please try again.");
    }
  };

  return (
    <ScreenContainer scrollable keyboardAvoiding>
      <Header showBack transparent />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={COLORS.secondary.gradient}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="person-add" size={32} color={COLORS.white} />
            </LinearGradient>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Start your German learning journey
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Display Name"
            placeholder="How should we call you?"
            value={displayName}
            onChangeText={setDisplayName}
            error={errors.displayName}
            leftIcon="person-outline"
            autoCapitalize="words"
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            leftIcon="lock-closed-outline"
            secureTextEntry
            showPasswordToggle
            hint="At least 6 chars, 1 uppercase, 1 number"
          />

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBarTrack}>
                <View
                  style={[
                    styles.strengthBarFill,
                    {
                      width: `${((passwordStrength.score + 1) / 4) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.strengthLabel,
                  { color: passwordStrength.color },
                ]}
              >
                {passwordStrength.label}
              </Text>
            </View>
          )}

          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            leftIcon="lock-closed-outline"
            secureTextEntry
            showPasswordToggle
          />

          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            variant="secondary"
            style={styles.signUpButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACING.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING["2xl"],
  },
  iconContainer: {
    marginBottom: SPACING.lg,
  },
  iconGradient: {
    width: 70,
    height: 70,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.secondary.default,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.muted,
    textAlign: "center",
  },
  form: {
    marginBottom: SPACING.xl,
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    marginTop: -SPACING.xs,
  },
  strengthBarTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.surface.secondary,
    borderRadius: 2,
    marginRight: SPACING.sm,
    overflow: "hidden",
  },
  strengthBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthLabel: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: "600",
    minWidth: 50,
  },
  signUpButton: {
    marginTop: SPACING.lg,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: SPACING.xl,
  },
  footerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.muted,
    marginRight: SPACING.xs,
  },
  loginLink: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary.default,
    fontWeight: "600",
  },
});

export default SignUpScreen;
