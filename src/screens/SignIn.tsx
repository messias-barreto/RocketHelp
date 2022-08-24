import { Heading, Icon, useTheme, VStack } from 'native-base';
import Logo from '../assets/logo_primary.svg';
import { Input } from '../components/Input';
import { Envelope, Key } from 'phosphor-react-native';
import { Button } from '../components/Button';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

export function SignIn(){
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function handleSignIn() {
        if(!email || !password) {
            return Alert.alert('Entrar', 'Informe Email ou Senha');
        }

        setIsLoading(true);

        auth().signInWithEmailAndPassword(email.trim(), password.trim())
        .catch((error) => {
            console.log(error)
            setIsLoading(false);

            if(error.code === 'auth/invalid-email'){
                return Alert.alert('Entrar', 'E-mail inválido');
            }

            if(error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'){
                return Alert.alert('Entrar', 'E-mail ou senha inválida');
            }

            return Alert.alert('Entrar', 'Não foi possível Acessar a Conta!')
        })
    }

    return (
       <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
           <Logo />
           <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
               Acesse sua conta
           </Heading>
            
            <Input  placeholder="E-mail" 
                    marginBottom={4}
                    InputLeftElement={
                        <Icon as={<Envelope color={colors.gray[300]}/>} ml={4} />
                    } 
                    onChangeText={setEmail}
            />

            <Input  placeholder="Senha"
                    marginBottom={8}
                    secureTextEntry
                    InputLeftElement={
                        <Icon as={<Key color={colors.gray[300]}/>} ml={4} />
                    }
                    onChangeText={setPassword}
            />

            <Button title="Entrar" w="full" onPress={handleSignIn} isLoading={isLoading}/>
       </VStack>
    )
}