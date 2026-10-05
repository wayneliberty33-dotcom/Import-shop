import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

const redirectTo = 'libwayshop://';

async function handleAuthCallback(url: string) {
  const hash = url.split('#')[1];

  if (!hash) {
    return;
  }

  const params = new URLSearchParams(hash);

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!accessToken || !refreshToken) {
    return;
  }

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    Alert.alert('Sign-in error', error.message);
  }
}

export default function LoginScreen() {
    const router = useRouter();
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      Alert.alert('Sign-in error', error.message);
      return;
    }

    if (!data?.url) {
      Alert.alert('Sign-in error', 'Could not start Google sign-in.');
      return;
    }

    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectTo,
    );

  if (result.type === 'success' && result.url) {
  await handleAuthCallback(result.url);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    router.replace('/');
  }
}
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LIBWAY SHOP</Text>

      <Text style={styles.subtitle}>
        Sign in to use your shared cart.
      </Text>

      <Button
        title="Continue with Google"
        onPress={signInWithGoogle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
});