import { Text, TextInput, View, Button} from 'react-native';
import { useState } from 'react'

export default function App(){
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [imc, setImc] = useState(null);

  const calcularIMC = () =>{
    const pesoFloat = parseFloat(peso);
    const alturaFloat = parseFloat(altura);
    setImc((pesoFloat)/(alturaFloat * alturaFloat));
  }

  const classificar = () => {
    if(imc > 30){
      return(<Text>Obesidade 1</Text>)
    }
  }
  
  return(
    <View style={{backgroundColor: 'lightgrey'}}>
      <Text style={{textAlign: 'center', fontWeight: 'bold', backgroundColor: '#AFAAAA', color: 'white'}}>CALCULADORA DE IMC</Text>
      <Text>Altura:</Text>
      <TextInput style={{borderWidth: 1, marginBottom:10}} value={altura} onChangeText={setAltura} keyboardType="numeric"/>
      <Text>Peso:</Text>
      <TextInput style={{borderWidth: 1, marginBottom:10}} value={peso} onChangeText={setPeso} keyboardType="numeric"/>
      <Button title="Calcular" onPress={calcularIMC}/>
      
      {imc !== null && (
        <Text>Seu IMC é {imc}</Text>
      )}
      <View>{classificar()}</View>
    </View>
  )
}

