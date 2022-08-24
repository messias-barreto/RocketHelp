import { Center, Spinner } from "native-base";

export function Loaging(){
    return(
        <Center flex={1} bg="gray.700">
            <Spinner color="secundary.700" />        
        </Center>
    )
}