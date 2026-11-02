import { router } from 'expo-router';
import { Btn, Screen, Txt } from '../components/ui';

export default function NotFound() {
  return (
    <Screen>
      <Txt v="display">Страница не найдена</Txt>
      <Btn label="На главную" onPress={() => router.replace('/')} />
    </Screen>
  );
}
