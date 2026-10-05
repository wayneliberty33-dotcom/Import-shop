import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { supabase } from './lib/supabase';

export default function App() {
  const connectionReady = Boolean(supabase);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LIBWAY SHOP</Text>
      <Text>Mobile app is connected to Supabase.</Text>
      <Text>{connectionReady ? 'Connection ready ✓' : 'Connection unavailable'}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
});
