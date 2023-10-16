import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { routes } from "../../routes";
import OrderContext from "../../contexts/OrderContext";
import { Title } from "../../components/title/Title";
import { convertToCurrency } from "../../helpers/convertToCurrency";
import {
  SummaryActionWrapper,
  SummaryAmount,
  SummaryContentWrapper,
  SummaryDescription,
  SummaryDetails,
  SummaryImage,
  SummaryPrice,
  SummaryTitle,
} from "./Summary.style";
import { Button } from "../../components/button/Button";

interface PizzaFlavour {
  id: string;
  name: string;
  image: string;
  price: { [key: string]: number };
}

export default function Summary() {
  const navigate = useNavigate();

  const { pizzaSize, pizzaFlavour, setPizzaOrder } = useContext(OrderContext);
  const [summaryAmount, setSummaryAmount] = useState<number>(0);
  const [summaryData, setSummaryData] = useState<PizzaFlavour[]>([]);
  
  


  const handleBack = () => {
    navigate(routes.pizzaFlavour);
  };


  const handleNext = () => {
    const payload = {
      item: {
        name: summaryData.map((item) => `${item.quant}x ${item.name}`).join(", "),
        size: pizzaSize[0].text,
        slices: pizzaSize[0].slices,
        value: summaryAmount,
      },
    };


  

    setPizzaOrder(payload);
    navigate(routes.checkout);
  };



  const handleRemove = (id) => {
    const updtSummaryData = summaryData.filter((item) => item.id !== id);
    setSummaryData(updtSummaryData);

    const updatedAmount = updtSummaryData.reduce((total, flavour) => {
      return total + flavour.price[pizzaSize[0].slices] * flavour.quant;
    }, 0);


    setSummaryAmount(updatedAmount);
  };



  useEffect(() => {
    if (!pizzaFlavour || !pizzaSize) {
      return navigate(routes.pizzaFlavour);
    }

    const selectedFlavours = pizzaFlavour.map((flavour) => ({
      ...flavour,
      quant: pizzaFlavour.filter((f) => f.id === flavour.id).length,
    }));

    
    const summaryMap = new Map();
    for (const flavour of selectedFlavours) {
      if (summaryMap.has(flavour.id)) {
        summaryMap.get(flavour.id).quant += 1;
      } else {
        summaryMap.set(flavour.id, { ...flavour, quant: 1 });
      }
    }


    const summaryArray = Array.from(summaryMap.values());
    

    const totalAmount = summaryArray.reduce((total, flavour) => {
      return total + flavour.price[pizzaSize[0].slices] * flavour.quant;
    }, 0);




    setSummaryData(summaryArray);
    setSummaryAmount(totalAmount);
  }, [pizzaFlavour, pizzaSize]);





  return (
    <Layout>
      <Title tabIndex={0}>Resumo do pedido</Title>
      <SummaryContentWrapper>
        {summaryData.map((data, index) => (
          <SummaryDetails key={index}>
            <SummaryImage src={data.image} alt={data.name} />
            <SummaryTitle>{data.name}</SummaryTitle>
            <SummaryDescription>
              {data.quant}x {pizzaSize[0].text} ({pizzaSize[0].slices} pedaços)
            </SummaryDescription>
            <SummaryPrice>
              {convertToCurrency(data.price[pizzaSize[0].slices] * data.quant)}
            </SummaryPrice>

            <Button
              onClick={() => handleRemove(data.id)}
              style={{ marginLeft: "1rem" }}
            >Remover</Button>

          </SummaryDetails>
        ))}
        <SummaryAmount>
          <SummaryPrice>{convertToCurrency(summaryAmount)}</SummaryPrice>
        </SummaryAmount>
      </SummaryContentWrapper>
      <SummaryActionWrapper>
        
        <Button inverse="inverse" onClick={handleBack}>
          Voltar
        </Button>
        <Button onClick={handleNext}>Ir para o pagamento</Button>
      </SummaryActionWrapper>
    </Layout>
  );
}
