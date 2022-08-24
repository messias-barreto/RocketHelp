import { useNavigation, useRoute } from "@react-navigation/native";
import { Box, HStack, Input, ScrollView, Text, useTheme, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { OrderProps } from "../components/Order";
import firestore from '@react-native-firebase/firestore';
import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";
import { dataFormat } from "../utils/firestoreDataFormat";
import { Loaging } from "../components/Loading";
import { CircleWavyCheck, Clipboard, DesktopTower, Hourglass } from "phosphor-react-native";
import { CardDetails } from "../components/CardDetails";
import { Button } from "../components/Button";
import { Alert } from "react-native";
import { color } from "native-base/lib/typescript/theme/styled-system";
type RoutesParams = {
    orderId: string
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
}

export function Details() {
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
    const [isLoading, setIsLoading] = useState(true);
    const [solution, setSolution] = useState('');
    const { colors } = useTheme();
    const navigation = useNavigation();

    const route = useRoute();
    const { orderId } = route.params as RoutesParams;

    function handleOrderClose(){
        if(!solution){
            return Alert.alert('Solução', 'Informe a solução para encerrar a solicitação');
        }

        firestore().collection<OrderFirestoreDTO>('orders')
        .doc(orderId)
        .update({
            status: 'closed',
            solution,
            closed_at: firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            Alert.alert('Solicitação', 'Solicitação encerrada.')
            navigation.goBack();
        })
        .catch((error) => {
            console.log(error);
            Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação')
        })
    }

    useEffect(() => {
        firestore().collection<OrderFirestoreDTO>('orders')
        .doc(orderId)
        .get()
        .then((doc) => {
            const { patrimony, description, status, created_at, closed_at, solution} = doc.data();
            const closed = closed_at ? dataFormat(closed_at) : null;

            setOrder({
                id: doc.id,
                patrimony,
                description,
                status,
                solution,
                when: dataFormat(created_at),
                closed
            });

            setIsLoading(false)
        })
    }, []);

    if(isLoading) {
        return <Loaging />
    }

    return(
        <VStack flex={1} bg="gray.700">
            <Box px={6} bg="gray.600"> 
                <Header title="Solicitação" /> 
            </Box>
            
            <HStack bg="gray.500" justifyContent="center" p={4}>
                {
                    order.status === 'closed' 
                    ? <CircleWavyCheck size={22} color={colors.green[300]} />
                    : <Hourglass size={22} color={colors.green[300]} />
                }

                <Text   
                    fontSize="sm" 
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2} textTransform="uppercase"> 

                    {order.status === 'closed' ? 'finalizado' : 'em andamento'}
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails title="Equipamento"
                                description={`Patrimônio: ${order.patrimony}`}
                                icon={DesktopTower}/>

                <CardDetails title="Descrição do Problema"
                                description={order.description}
                                icon={Clipboard}
                                footer={`Registrado em: ${order.when}`}
                                />
                
                <CardDetails title="Solução"
                                icon={CircleWavyCheck}
                                description={order.solution}
                                footer={order.closed && `Encerrado em ${order.closed}`}>

                {
                    order.status === 'open' && 
                        <Input placeholder="Descrição da Solução"
                            onChangeText={setSolution}
                            textAlignVertical="top"
                            multiline 
                            h={24}
                        />
                }         

                </CardDetails>
            </ScrollView>

            {
                !order.closed && <Button title="Encerrar solicitação" m={5} onPress={handleOrderClose}/>
            }
            
        </VStack>
    );
}