import React from 'react';
import { Box, Container, Text, useColorModeValue } from '@chakra-ui/react';
import PredictionContext from '../../helper/PredictionContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { predictionsArray } = React.useContext(PredictionContext);
  console.log(predictionsArray);
  const history = useNavigate();
  const colors = {
    bg: useColorModeValue('purple.100', 'purple.900'),
    text: useColorModeValue('blue', 'white'),
  };

  return (
    <Container
      width="auto"
      maxWidth="100vw"
      bg={colors.bg}
      height="auto"
      maxHeight="100vh"
      padding="10vh"
    >
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {predictionsArray.map((pred, i) => {
          return (
            <Box
              key={i}
              onClick={() => history('/predict/' + pred.id)}
              display="flex"
              maxWidth="3000px"
              border="1px solid"
              borderRadius="15px"
              padding="20px"
              margin="10px"
            >
              <Text color={colors.text}>{pred.value.proposalName} &nbsp; {"\n"} </Text> 
			  <Text color={colors.text}> <b> Status </b> : {pred.value.proposalStatus} &nbsp; </Text> {"\n"}
			  <Text color={colors.text}><b> Result </b>: {pred.value.finalResult}</Text>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}
